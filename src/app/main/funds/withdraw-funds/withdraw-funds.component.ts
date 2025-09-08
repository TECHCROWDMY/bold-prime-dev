import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-withdraw-funds',
  templateUrl: './withdraw-funds.component.html',
  styleUrls: ['./withdraw-funds.component.scss'],
})
export class WithdrawFundsComponent {
  withdrawFundsForm!: FormGroup;
  TransferFundsForm!: FormGroup;
  isLoading: any = false;
  isSubmitted: any = false;
  /***** STEPS MANAGE   *****/

  //country list and currency manage
  userDetails: any;
  userCountry: any;
  depositCountry: any = '';
  USDPrice: any;

  bannerList: any = [];
  initialModal: any = true;
  transferModal: any = false;
  confirmModal: any = false;

  totalAccList: any = [];
  accountListArray: any = [];
  paymentListArray: any = [];
  paymentValue: any = '';
  paymentNameValue: any;
  walletID: any;
  currency: any;
  withdrawTo: any;
  paymentDetailsDrop: any = [];

  withdrawFundsFormInfo: any = {
    loginSid: '',
  };
  TransferFundsFormInfo: any = {
    amount: '',
  };
  currencyArray: any = [];

  LoginSidlogin: any;
  depositName: any;
  CurrencyValue: any;
  LoginsFormID: any;

  // APi min max amount
  minAmount: any = 0;
  maxAmount: any = 0;

  // First form array
  fields: any = {
    flow_withdrawal_instance: '',
    flow_withdrawal_step: 2,
    amount: 0,
    calculatedAmount: null,
  };
  // Second form array
  fieldsFormC: any = {
    flow_withdrawal_instance: '',
    flow_withdrawal_step: 3,
    token: '',
  };

  selectedOption: any;
  LoginsFormIDSecond: any;
  typingTimer: any;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private titleService: Title
  ) {
    this.userDetails = localStorage.getItem('boldUserDetail' || '');
    var user: any = JSON.parse(this.userDetails);
    const userAccess = user?.financialPermissions?.find(
      (x: any) => x == 'withdraw'
    );
    if (!userAccess) {
      this.toastrService.error(
        'This operation is not allowed',
        'Admin paused this functionality for you'
      );
    }

    this.userDetails = JSON.parse(localStorage.getItem('boldUserDetail') || '');
    this.userCountry = this.userDetails.country;
    this.getCountryList();
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('withdraw');
    this.commonService.pageName = 'Withdraw Funds';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.getAccountList();
    this.setForm();
    this.setTransferForm();
    this.getBannerList();
  }

  /***** HTML DATA MANAGFE  *****/
  getDataRow(val: any, key: any) {
    var finalValue: any;
    for (let index = 0; index < val.data.length; index++) {
      const element = val.data[index];
      var changeKey = element.key.replace(/,/g, ' ').split('_');
      if (changeKey.indexOf('preview') >= 0 && key == 'preview') {
        const baseURL = API.IMAGE_BASE_URL;
        finalValue = `${baseURL}${element.value}`;
        break;
      } else if (changeKey.indexOf('size') >= 0 && key == 'size') {
        finalValue = element.value;
        break;
      } else if (changeKey.indexOf('language') >= 0 && key == 'language') {
        finalValue = element.value;
        break;
      } else if (changeKey.indexOf('campaign') >= 0 && key == 'campaign') {
        finalValue = element.value;
        break;
      }
    }
    return finalValue;
  }

  getBannerList() {
    this.isLoading = true;
    let body = {
      tableConfig: {
        filters: [
          {
            field: '',
            modificator: '',
            value: '',
          },
        ],
        segment: {
          limit: '1000',
          offset: 0,
        },
        sorting: {
          field: '',
          direction: 'DESC',
        },
        csv: false,
        withTotals: false,
      },
    };
    this.apiService.callApiPostRequest(API.BANNER_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          this.bannerList = res.rows;
          this.isLoading = false;
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  // currencyFor(val: any) {
  //   const value = val ? Number(val).toFixed(2) : '0.00'
  //   return value;
  // }

  currencyFor(val: any) {
    const formattedValue = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val));

    return formattedValue;
  }

  /***** FORM MANAGE   *****/
  setTransferForm() {
    this.TransferFundsForm = this.formBuilder.group({
      amount: [this.TransferFundsFormInfo.amount, [Validators.required]],
    });
  }
  getCountryList() {
    fetch('https://api.frankfurter.app/currencies')
      .then((data: any) => data.json())
      .then((data: any) => {
        this.commonCountry(data);
      });
  }

  commonCountry(data: any) {
    Object.keys(data).forEach((key) => {
      var countryKey = key.split('')[0] + key.split('')[1];
      if (key == this.userCountry) {
        this.depositCountry = key;
      } else if (countryKey == this.userCountry) {
        this.depositCountry = key;
      }
    });
    setTimeout(() => {
      this.depositCountry =
        this.depositCountry == '' ? 'USD' : this.depositCountry;
    }, 200);
  }

  inrPrice(event: any) {
    this.TransferFundsForm.controls['amount'].setValue(event.target.value);
    const currentAmount = event.target.value;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getCurrency(currentAmount);
    }, 1000);
  }

  getCurrency(val: any) {
    if (val != 0) {
      const host = 'api.frankfurter.app';
      var currency2 = this.depositCountry;
      var currency1 = 'USD';

      this.isLoading = true;
      let body = {
        fromCurrency: currency1,
        toCurrency: currency2,
        amount: val,
        direction: 'direct',
      };
      this.apiService.callApiPostRequest(API.CONVERT_RATE, body).subscribe(
        (res: any) => {
          if (res) {
            this.isLoading = false;
            this.USDPrice = res.rate;
          }
        },
        (err: any) => {
          this.isLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        }
      );
      // const ApiName = `https://${host}/latest?amount=${val}&from=${currency1}&to=${currency2}`
      // fetch(ApiName).then((val) => val.json())
      //   .then((val: any) => {
      //     this.USDPrice = Object.values(val.rates)[0]
      //   });
    } else if (val == '' || val == 0) {
      this.USDPrice = val;
    }
  }

  /***** FORM MANAGE  *****/
  setForm() {
    this.withdrawFundsForm = this.formBuilder.group({
      loginSid: [this.withdrawFundsFormInfo.loginSid, [Validators.required]],
    });
  }

  dropdownArray() {
    for (let index = 0; index < this.totalAccList.length; index++) {
      const element = this.totalAccList[index];
      if (index == 0) {
        this.accountListArray.push({
          title: element.type.title,
          data: [element],
        });
        this.LoginSidlogin = `${element.loginSid}`;
        this.withdrawFundsForm.controls['loginSid'].setValue(
          this.LoginSidlogin
        );
        this.getwithdrawPaymentType(this.LoginSidlogin);
        this.selectedOption =
          element.loginSid +
          '+' +
          element.balance +
          '+' +
          element.type.title +
          '+' +
          element.login;
        this.depositName = element.type.title + ' ' + element.login;
        this.CurrencyValue = element.balance;
        this.LoginsFormIDSecond = element.login;
      } else {
        for (
          let indexArray = 0;
          indexArray < this.accountListArray.length;
          indexArray++
        ) {
          const item = this.accountListArray[indexArray];
          if (item.title == element.type.title) {
            this.accountListArray[indexArray].data.push(element);
            break;
          } else if (indexArray + 1 == this.accountListArray.length) {
            this.accountListArray.push({
              title: element.type.title,
              data: [element],
            });
            break;
          }
        }
      }
    }
    this.isLoading = false;
  }

  selectDrop(event: any) {
    const loginSIDCheck = event.target.value.split('+')[0];
    if (this.LoginSidlogin !== loginSIDCheck) {
      this.paymentValue = '';
      this.paymentNameValue = '';
      this.paymentDetailsDrop = [];
      this.LoginSidlogin = event.target.value.split('+')[0];
      this.CurrencyValue = event.target.value.split('+')[1];
      this.depositName = event.target.value.split('+')[2];
      this.LoginsFormID = event.target.value.split('+')[3];
      this.withdrawFundsForm.controls['loginSid'].setValue(event.target.value);
      this.getwithdrawPaymentType(this.LoginSidlogin);
    }
  }

  /***** STEP 1 PAYMENT DETAILS LIST  *****/
  getwithdrawPaymentType(val: any) {
    this.isLoading = true;
    const ApiName = API.WITHDRAWAL_DETAILS + `/${val}` + '?version=1.0.0';

    this.apiService.callApiGetRequest(ApiName, {}).subscribe(
      (res: any) => {
        if (res) {
          this.paymentListArray = res;
        }
        this.isLoading = false;
      },
      (err: any) => {
        this.isLoading = false;

        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  paymentUpdate() {
    this.router.navigate(['/app/wallets']);
  }

  /***** ACCOUNT LIST   *****/
  getAccountList() {
    this.isLoading = true;
    this.apiService
      .callApiPostRequest(API.ACCOUNTS, {
        category: 'live',
        scope: 'withdrawal',
      })
      .subscribe(
        (res: any) => {
          if (res) {
            for (let index = 0; index < res.length; index++) {
              const element = res[index];
              if (
                element.type.category != 'demo' &&
                element.type.category != 'ib_wallet'
              ) {
                this.totalAccList.push(element);
              }
            }
            this.dropdownArray();
          }
        },
        (err: any) => {
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        }
      );
  }

  selectCurrency(event: any) {
    this.currency = event.target.value;
  }
  setPaymentValue(item: any) {
    if (item.id != this.paymentValue) {
      this.currency = item.currencies ? item.currencies[0] : null;
      this.currencyArray = item.currencies;
      this.isLoading = true;
      this.paymentValue = item.id;
      this.paymentNameValue = item.displayName;
      if (item.paymentDetailsRequired == true) {
        const APiName = API.GET_PAYMENT_ACCOUNT_WALLET + `/${item.id}`;
        this.apiService.callApiGetRequest(APiName, {}).subscribe(
          (res: any) => {
            if (res) {
              if (res.length > 0) {
                this.walletID = res[0].id;
                this.withdrawTo = res[0].number;
                this.paymentDetailsDrop = res;
              }
            }
            this.isLoading = false;
          },
          (err: any) => {
            this.isLoading = false;
            this.toastrService.error(
              err.error.message ? err.error.message : 'something went wrong'
            );
          }
        );
      } else {
        this.walletID = '';
        this.isLoading = false;
      }
      // this.getAmountDetails(item);
    }
  }

  get f() {
    return this.withdrawFundsForm.controls;
  }
  get a() {
    return this.TransferFundsForm.controls;
  }

  imagecheck(val: any) {
    var finalImage: any;
    if (val.logo != null && val.logo != undefined) {
      finalImage = false;
    } else {
      finalImage = true;
    }
    return finalImage;
  }

  imageFormat(val: any) {
    var finalImage: any;
    if (val.logo != null && val.logo != undefined) {
      finalImage = `${API.IMAGE_BASE_URL}${val.logo}`;
    } else {
      finalImage = '';
    }
    return finalImage;
  }

  backHandle(val: any) {
    if (val == 'backInitial') {
      this.initialModal = true;
      this.transferModal = false;
    } else if (val == 'backTransfer') {
      this.transferModal = true;
      this.confirmModal = false;
    }
  }

  onSubmitSecondForm() {
    // this.isLoading = false;
    this.isSubmitted = true;
    if (this.TransferFundsForm.invalid) return;
    if (
      this.TransferFundsForm.controls['amount'].value < this.minAmount &&
      this.minAmount != 0
    )
      return;
    if (
      this.TransferFundsForm.controls['amount'].value > this.maxAmount &&
      this.maxAmount != 0
    )
      return;
    this.fields.amount = this.TransferFundsForm.controls['amount'].value;
    let body = { form: this.fields };
    this.http
      .post(API.PAYMENT_ACCOUNT, body, {
        observe: 'response',
        responseType: 'json',
        withCredentials: true,
        reportProgress: true,
      })
      .subscribe(
        (response: HttpResponse<any>) => {
          let res = response.body;
          if (res) {
            if (res.form.errors.length > 0) {
              for (let index = 0; index < res.form.errors.length; index++) {
                const element = res.form.errors[index];
                this.toastrService.error(element);
              }
            } else if (res?.form?.errors?.length == 0) {
              let formFields = res.form.fields;
              for (let index = 0; index < formFields.length; index++) {
                const element = formFields[index];

                if (element.name == 'flow_withdrawal_instance') {
                  this.fieldsFormC.flow_withdrawal_instance = element.value;
                }
                if (element.name == 'token') {
                  this.fieldsFormC.token = element.value;
                }
              }
              this.confirmModal = true;
              this.transferModal = false;
              this.isLoading = false;
              this.isSubmitted = false;
            }
          }
        },
        (err: any) => {
          this.isSubmitted = false;
          this.isLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        }
      );
  }

  submitForm() {
    this.isLoading = true;
    let body = { form: this.fieldsFormC };
    this.http
      .post(API.PAYMENT_ACCOUNT, body, {
        observe: 'response',
        responseType: 'json',
        withCredentials: true,
        reportProgress: true,
      })
      .subscribe(
        (response: HttpResponse<any>) => {
          let res = response.body;
          if (res) {
            if (res?.form?.errors?.length > 0) {
              for (let index = 0; index < res.form.errors.length; index++) {
                const element = res.form.errors[index];
                this.toastrService.error(element);
              }
              this.isLoading = false;
              this.isSubmitted = false;
              this.toastrService.success('Withdraw Oprations Success');
              this.router.navigate(['/app/transactions-history']);
            } else {
              if (res.transactionId) {
                this.toastrService.success('Withdraw Oprations Success');
                this.router.navigate(['/app/transactions-history']);
              }
            }
          }
          this.isLoading = false;
          this.isSubmitted = false;
        },
        (err: any) => {
          this.isSubmitted = false;
          this.isLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'Something went wrong'
          );
        }
      );
  }

  selectUploadPaymentType(event: any) {
    this.walletID = event.target.value.split('+')[0];
    this.withdrawTo = event.target.value.split('+')[1];
  }

  // form 1
  onSubmitFirst() {
    this.isSubmitted = true;
    if (this.withdrawFundsForm.invalid) return;
    if (!this.paymentValue) return;
    if (this.walletID) {
      this.isLoading = true;
      let body = {
        paymentSystem: this.paymentValue ? this.paymentValue : '',
        account: this.LoginSidlogin ? this.LoginSidlogin : '',
        wallet: this.walletID,
        currency: this.currency,
      };
      // this.apiService.callApiPostRequest(API.PAYMENT_ACCOUNT, body,{
      this.http
        .post(API.PAYMENT_ACCOUNT, body, {
          observe: 'response',
          responseType: 'json',
          withCredentials: true,
          reportProgress: true,
        })
        .subscribe(
          (response: HttpResponse<any>) => {
            let res = response.body;
            if (res) {
              this.isLoading = false;
              if (res?.form?.errors?.length > 0) {
                for (let index = 0; index < res.form.errors.length; index++) {
                  const element = res.form.errors[index];
                  this.toastrService.error(element);
                }
              } else if (res.form.errors.length == 0) {
                if (res.step2AdditionalData != null) {
                  this.minAmount = parseInt(
                    res.step2AdditionalData.minAmount
                      ? res.step2AdditionalData.minAmount
                      : '0'
                  );
                  this.maxAmount = parseInt(
                    res.step2AdditionalData.maxAmount
                      ? res.step2AdditionalData.maxAmount
                      : '0'
                  );
                }
                let formFields = res.form.fields;
                let showError = false;
                for (let index = 0; index < formFields.length; index++) {
                  const element = formFields[index];
                  if (element.name == 'account') {
                    if (element?.errors && element?.errors[0]) {
                      showError = true;
                      this.toastrService.error(element?.errors[0]);
                    }
                  }
                  if (element.name == 'flow_withdrawal_instance') {
                    this.fields.flow_withdrawal_instance = element.value;
                  }
                  if (showError == false && index + 1 == formFields?.length) {
                    this.initialModal = false;
                    this.isSubmitted = false;
                    this.transferModal = true;
                  }
                }
              }
            }
          },
          (err: any) => {
            this.isLoading = false;
            this.toastrService.error(
              err.error.message ? err.error.message : 'something went wrong'
            );
          }
        );
    }
  }
}
