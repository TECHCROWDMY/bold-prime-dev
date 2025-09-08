import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { API } from 'src/app/shared/constants/constant';
import { DemoAccountComponent } from 'src/app/shared/modals/demo-account/demo-account.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FundsDepositWithdrawService } from 'src/app/shared/services/funds-deposit-withdraw.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import axios from 'axios';

import { ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-deposit-funds',
  templateUrl: './deposit-funds.component.html',
  styleUrls: ['./deposit-funds.component.scss'],
})
export class DepositFundsComponent implements AfterViewInit {
  @ViewChild('myButton', { static: false })
  myButton!: ElementRef;

  depositFundsForm!: FormGroup;
  TransferFundsForm!: FormGroup;

  isLoading: any = false;
  isSubmitted: any = false;
  formOfDeposit: any = '';
  showMoreData: any = false;

  userDetails: any;
  userCountry: any;
  depositCountry: any = '';

  /***** STEPS MANAGE   *****/
  initialModal: any = true;
  transferModal: any = false;
  confirmModal: any = false;
  selectedCurrencies: any = false;
  totalAccList: any = [];
  accountListArray: any = [];
  paymentListArray: any = [];
  depositName: any;
  LoginsFormID: any;
  paymentValue: any;
  paymentNameValue: any;
  LoginSidlogin: any;
  CurrencyValue: any;
  modalRef: any;
  USDPrice: any;
  depositFundsFormInfo: any = {
    loginSid: '',
  };
  bannerList: any = [];
  TransferFundsFormInfo: any = {
    amount: '',
  };
  selectedOption: any;
  USDAmount: any;
  currency: any = '';
  discription: any = '';
  formattedHtml!: SafeHtml; // Use the non-null assertion operator
  plainText: string = ''; // Provide an initial value
  // APi min max amount

  minAmount: any = 0;
  maxAmount: any = 0;
  loadMoreButton: any = true;
  // second form array

  fields: any = {
    flow_deposit_instance: '',
    flow_deposit_step: '',
    amount: 0,
    calculatedAmount: null,
  };
  fieldsFormC: any = {
    flow_deposit_instance: '',
    flow_deposit_step: 3,
    hidden: null,
    token: '',
  };
  typingTimer: any;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    public bsModalService: BsModalService,
    private fundsDepositWithdrawService: FundsDepositWithdrawService,
    private http: HttpClient,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('boldUserDetail') || '');
    this.userCountry = this.userDetails.country;
    this.getCountryList();
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('deposit');
    this.commonService.pageName = 'Deposit Funds';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.getAccountList();
    // this.getdepositPaymentType()
    this.setLoginSIDForm();
    this.setTransferForm();
    this.getBannerList();
    this.route.queryParams.subscribe((params) => {
      this.selectedOption = params['selected'];
      this.LoginSidlogin = params['loginId'];
    });
  }

  setDefaultOption() {
    if (this.LoginSidlogin && this.accountListArray) {
      for (const group of this.accountListArray) {
        const matchingElement = group.data.find((element: { loginSid: string }) => element.loginSid === this.LoginSidlogin);
        if (matchingElement) {
          this.selectedOption = `${matchingElement.loginSid}+${matchingElement.balance}+${matchingElement.type.title}+${matchingElement.login}`;
          break;
        }
      }
    }
  }

  getCountryList() {
    fetch('https://api.frankfurter.app/currencies')
      .then((data: any) => data.json())
      .then((data: any) => {
        this.commonCountry(data);
      });
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

  imagePagehandle() {
    window.open('https://new.myboldprime.com/');
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

  /***** MODAL OPEN DEMO AND LIVE  *****/

  pageHandle() {
    this.modalRef = this.bsModalService.show(DemoAccountComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        types: 'live',
      },
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
  /***** FORM MANAGE  *****/
  setLoginSIDForm() {
    this.depositFundsForm = this.formBuilder.group({
      loginSid: [this.depositFundsFormInfo.loginSid, [Validators.required]],
    });
  }

  /***** FORM MANAGE   *****/
  setTransferForm() {
    this.TransferFundsForm = this.formBuilder.group({
      amount: [this.TransferFundsFormInfo.amount, [Validators.required]],
    });
  }

  /***** STEP 1 PAYMENT DETAILS LIST  *****/
  getdepositPaymentType(val: any) {
    this.isLoading = true;
    const ApiName = API.DEPOSIT_PAYMENT_TYPE + `/${val}` + '?version=1.0.0';

    // this.http.get(ApiName, { observe:'response'}).subscribe(
    //   (response: HttpResponse<any>) => {
    //     // Handle the API response
    //     console.log(response);

    //     // Access the response headers
    //     const headers = response.headers;
    //     const cookie = headers.getAll('Set-Cookie');
    //     console.log(cookie);
    //     this.isLoading = false;
    //   },
    //   (error) => {
    //     // Handle errors
    //     console.error(error);
    //   }
    // );

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

  showData() {
    this.showMoreData = true;
    this.loadMoreButton = false;
  }

  /***** ACCOUNT LIST   *****/
  getAccountList() {
    this.isLoading = true;
    this.apiService
      .callApiPostRequest(API.ACCOUNTS, {
        category: '',
        scope: 'all',
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
            this.setDefaultOption();
          }
        },
        (err: any) => {
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        }
      );
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

  pageRedirectManage() {
    this.router.navigate([`/app/deposit`]);
  }

  /***** FORMAT & VALUE MANAGE  *****/
  imageFormat(val: any) {
    var finalImage: any;
    if (val.logo != null && val.logo != undefined) {
      finalImage = `${API.IMAGE_BASE_URL}${val.logo}`;
    } else {
      finalImage = '';
    }
    return finalImage;
  }

  selectCurrency(event: any) {
    this.currency = event.target.value;
  }
  setPaymentValue(item: any) {
    // console.log(item)
    this.paymentValue = item.id;
    this.paymentNameValue = item.displayName;
    if (item?.currencies?.length > 0) {
      this.currency = item?.currencies[0];
    } else {
      this.currency = '';
    }
    this.selectedCurrencies = item.currencies;
  }

  selectDrop(event: any) {
    this.LoginSidlogin = event.target.value.split('+')[0];
    this.CurrencyValue = event.target.value.split('+')[1];
    this.depositName = event.target.value.split('+')[2];
    this.LoginsFormID = event.target.value.split('+')[3];
    this.depositFundsForm.controls['loginSid'].setValue(event.target.value);
    this.getdepositPaymentType(this.LoginSidlogin);
  }

  get f() {
    return this.depositFundsForm.controls;
  }
  get a() {
    return this.TransferFundsForm.controls;
  }

  dropdownArray() {
    // const element = 4-52718;
    //   console.log(element);

    //     this.accountListArray.push({
    //       title: element.type.title,
    //       data: [element],
    //     });
    for (let index = 0; index < this.totalAccList.length; index++) {
      const element = this.totalAccList[index];
      if (index == 0) {
        console.log(element.type.title);

          this.accountListArray.push({
            title: element.type.title,
            data: [element],
          });
          if (!this.LoginSidlogin) this.LoginSidlogin = `${element.loginSid}`;
          this.depositFundsForm.controls['loginSid'].setValue(this.LoginSidlogin);
          this.getdepositPaymentType(this.LoginSidlogin);
          if (!this.selectedOption)
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

  // depositStep1() {
  //   let body = {
  //     "paymentSystem": this.paymentValue ? this.paymentValue : '',
  //     "account": this.LoginSidlogin ? this.LoginSidlogin : ""
  //   }
  //   this.apiService.callApiPostRequest(API.DEPOSIT_ACCOUNT, body).subscribe((res: any) => {
  //     if (res) {
  //       console.log(res)
  //       if (res.form.errors.length > 0) {
  //         for (let index = 0; index < res.form.errors.length; index++) {
  //           const element = res.form.errors[index];
  //           this.toastrService.error(element);
  //         }
  //         this.isSubmitted = false;
  //         this.isLoading = false;

  //       } else if (res.form.errors.length == 0) {
  //         let formFields = res.form.fields
  //         for (let index = 0; index < formFields.length; index++) {
  //           const element = formFields[index];
  //           if (element.name == 'flow_deposit_instance') {
  //             this.fields.flow_deposit_instance = element.value
  //           }
  //           if (element.name == 'flow_deposit_step') {
  //             this.fields.flow_deposit_step = element.value
  //           }
  //         }
  //         this.depositStep2()
  //       }
  //     }
  //   }, (err: any) => {
  //     this.isSubmitted = false;
  //     this.isLoading = false;
  //     this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
  //   })

  // }

  /***** STEP 1 FORM SUBMIT  *****/

  onSubmitHandle() {
    this.isSubmitted = true;

    if (this.depositFundsForm.invalid) return;
    if (!this.paymentValue) return;

    // check account valid or not and account deposit get minimum and maximum amount
    var firstFormData;
    if (this.currency) {
      firstFormData = {
        paymentSystem: this.paymentValue ? this.paymentValue : '',
        account: this.LoginSidlogin ? this.LoginSidlogin : '',
        currency: this.currency,
      };
    } else {
      firstFormData = {
        paymentSystem: this.paymentValue ? this.paymentValue : '',
        account: this.LoginSidlogin ? this.LoginSidlogin : '',
      };
    }
    let body = firstFormData;
    this.isLoading = true;
    this.http
      .post(API.DEPOSIT_ACCOUNT, body, {
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
            } else if (res.form.errors.length == 0) {
              let formFields = res.form.fields;

              for (let index = 0; index < formFields.length; index++) {
                const element = formFields[index];

                if (element.name == 'flow_deposit_instance') {
                  this.fields.flow_deposit_instance = element.value;
                }
                if (element.name == 'flow_deposit_step') {
                  this.fields.flow_deposit_step = element.value;
                }
              }
              if (res.step2AdditionalData != null) {
                this.discription = res?.step2AdditionalData?.description || '';
                // this.discription = "<img src='https://fx.myboldprime.com/uploads/public/assets/2022/01/19/e7f6a6289a6a56ba2bf83dcec93096b9.png' alt='Placeholder Image'><p>This is a paragraph with <strong>strong</strong> and <em>emphasized</em> text.</p><a href='https://www.example.com' target='_blank'>Visit Example.com</a><ul><li>Unordered List Item 1</li><li>Unordered List Item 2</li><li>Unordered List Item 3</li></ul><ol><li>Ordered List Item 1</li><li>Ordered List Item 2</li><li>Ordered List Item 3</li></ol>";

                // this.discription = strippedHtml.replace(/<[^>]+>/g, '');
                this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
                  this.discription
                );
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = this.discription;
                this.plainText = tempDiv.innerText;
                this.currency = res?.step2AdditionalData?.currency;
                this.minAmount = res.step2AdditionalData.minAmount
                  ? parseInt(res.step2AdditionalData.minAmount) + 1
                  : '0';
                this.maxAmount = res.step2AdditionalData.maxAmount
                  ? parseInt(res.step2AdditionalData.maxAmount)
                  : '0';
              }

              this.isLoading = false;
              this.isSubmitted = false;
              this.initialModal = false;
              this.transferModal = true;
            }
          }

          this.isLoading = false;
        },
        (error) => {
          // Handle errors
          console.error(error);
        }
      );

    // this.fundsDepositWithdrawService.fundsHandle(API.DEPOSIT_ACCOUNT, body)
    //   .subscribe((data: any) => {
    //     const keys = data;
    //     const cookies = data.headers.getAll('Set-Cookie');
    //     // const cookiesAll = data.headers.getAll();
    //     // console.log(cookiesAll,"cookiesAll")
    //     console.log(cookies);
    //     console.log(keys);
    //   },)

    // REMOVE THIS COMMENT ONCE ALL DONE
    // this.apiService.callApiPostRequest(API.DEPOSIT_ACCOUNT, body).subscribe((res: any) => {
    //   if (res) {
    //     if (res.form.errors.length > 0) {
    //       console.log(res.form.errors.length)
    //       for (let index = 0; index < res.form.errors.length; index++) {
    //         const element = res.form.errors[index];
    //         console.log(element)
    //         this.toastrService.error(element);
    //       }
    //     } else if (res.form.errors.length == 0) {
    //       let formFields = res.form.fields
    //       for (let index = 0; index < formFields.length; index++) {
    //         const element = formFields[index];
    //         if (element.name == 'flow_deposit_instance') {
    //           this.fields.flow_deposit_instance = element.value
    //         }
    //         if (element.name == 'flow_deposit_step') {
    //           this.fields.flow_deposit_step = element.value
    //         }
    //       }
    //       if (res.step2AdditionalData != null) {
    //         this.minAmount = parseInt(res.step2AdditionalData.minAmount ? res.step2AdditionalData.minAmount : '0')
    //         this.maxAmount = parseInt(res.step2AdditionalData.maxAmount ? res.step2AdditionalData.maxAmount : '0')
    //       }
    //       this.isSubmitted = false;
    //       this.isLoading = false;
    //       this.initialModal = false;
    //       this.transferModal = true;
    //     }

    //   }

    // }, (err: any) => {
    //   this.isSubmitted = false;
    //   this.isLoading = false;
    //   this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    // })
  }

  /***** STEP BACK MANAGE   *****/
  backHandle(type: any) {
    if (type == 'backTrader') {
      this.confirmModal = false;
      this.transferModal = true;
    } else if (type == 'backInitial') {
      this.TransferFundsForm.controls['amount'].setValue('');
      this.USDPrice = '';
      this.transferModal = false;
      this.initialModal = true;
    }
  }

  /***** STEP 2 FORM SUBMIT   *****/

  onSubmitTrader() {
    this.isSubmitted = true;
    if (this.TransferFundsForm.invalid) return;
    if (
      this.TransferFundsForm.controls['amount'].value < this.minAmount &&
      this.minAmount != 0
    )
      return;
    if (
      parseInt(this.TransferFundsForm.controls['amount'].value) >
      parseInt(this.maxAmount && this.maxAmount != 0)
    )
      return;
    this.fields.amount = this.TransferFundsForm.controls['amount'].value;
    this.isLoading = true;
    let body = { form: this.fields };
    this.http
      .post(API.DEPOSIT_ACCOUNT, body, {
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
            } else if (res.form.errors.length == 0) {
              // fieldsFormB
              let formFields = res.form.fields;
              for (let index = 0; index < formFields.length; index++) {
                const element = formFields[index];
                if (element.name == 'flow_deposit_instance') {
                  this.fieldsFormC.flow_deposit_instance = element.value;
                }
                if (element.name == 'flow_deposit_step') {
                  this.fieldsFormC.flow_deposit_step = element.value;
                }
                if (element.name == 'token') {
                  this.fieldsFormC.token = element.value;
                }
              }

              this.confirmModal = true;
              this.transferModal = false;
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

  ngAfterViewInit() {}
  redirectPaymentMethod() {
    var formOfPayment = this.formOfDeposit;
    var newTab: any = window.open('', '_blank');
    newTab.document?.write(formOfPayment);
    newTab?.document?.close();
  }
  /***** STEP 3 FORM SUBMIT   *****/

  submitFormHandle() {
    this.isLoading = true;
    let body = { form: this.fieldsFormC };
    this.http
      .post(API.DEPOSIT_ACCOUNT, body, {
        observe: 'response',
        responseType: 'json',
        withCredentials: true,
        reportProgress: true,
      })
      .subscribe(
        (response: HttpResponse<any>) => {
          let res = response.body;
          if (res) {
            if (res?.depositResult?.content) {
              this.formOfDeposit = res?.depositResult?.content;
              this.renderer
                .selectRootElement(this.myButton.nativeElement)
                .click();
              this.isLoading = false;
              this.isSubmitted = false;
              this.router.navigate(['/app/transactions-history']);
            } else if (res && res?.form?.errors?.length > 0) {
              for (let index = 0; index < res.form.errors.length; index++) {
                const element = res.form.errors[index];
                this.toastrService.error(element);
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

  inrPrice(event: any) {
    var filterAmount;
    const value = event.target.value.split('.');
    let value1 = value[0];
    let value2 = value[1];
    const amoutA = value1
      ?.replace(/,/g, '')
      .split('')
      ?.filter((x: any) => new RegExp(/[0-9]/g).test(x));
    const amoutB = value2
      ?.replace(/,/g, '')
      .split('')
      ?.filter((x: any) => new RegExp(/[0-9]/g).test(x))
      .slice(0, 2);

    if (value2 == undefined) {
      filterAmount = amoutA.join('');
    } else {
      filterAmount = amoutA.join('') + '.' + amoutB.join('');
    }

    this.TransferFundsForm.controls['amount'].setValue(filterAmount);
    const currentAmount = filterAmount;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getCurrency(currentAmount);
    }, 1000);
  }

  getCurrency(val: any) {
    if (val != 0) {
      var currency2 = 'USD';
      var currency1 = this.currency;
      if (currency1 == currency2) {
        this.USDPrice = val;
      } else {
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
      }
    } else if (val == '' || val == 0) {
      this.USDPrice = val;
    }
  }
}
