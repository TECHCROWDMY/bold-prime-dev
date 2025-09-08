
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { API } from '../../constants/constant';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfer-funds',
  templateUrl: './transfer-funds.component.html',
  styleUrls: ['./transfer-funds.component.scss'],
})
export class TransferFundsComponent {
  public event: EventEmitter<any> = new EventEmitter();

  transferFundsForm!: FormGroup;
  transferAmountForm!: FormGroup;
  subscription: Subscription[] = [];
  balanceAmount:any;
  loginSid:any;
  isLoading: any = false;

  transferAccountModal: any = true;
  transferAmountModal: any = false;
  transferSuccessModal: any = false;

  fromCurrencyValue: any;
  fromLoginSidlogin: any;
  toLoginSidlogin: any;

  totalAccList: any = [];
  totalAccListTo: any = [];
  accountListArray: any = [];
  accountListArrayTo: any = [];

  isSubmitted: any = false;

  transferFundsFormInfo: any = {
    fromLoginSid: '',
    toLoginSid: '',
  };
  transferAmountFormInfo: any = {
    amount: '',
  };
  info: any;
  selectedOption:any

  transferFundRes: any;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalService: BsModalService,
    public commonService: CommonService,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    setTimeout(() => {
      this.selectedOption = this.loginSid + ' ' + this.balanceAmount;
      this.fromCurrencyValue = this.balanceAmount;
    }, 0);

  }

  ngOnInit(): void {
    this.getAccountList();
    this.setForm();
  }

  /***** GET ACCOUNT TYPE FROM FORM VALUE  *****/
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
              if (element.type.category != 'demo') {
                // && element.type.category != 'ib_wallet'
                this.totalAccList.push(element);
              }
              if (element.type.category != 'demo'
                && element.type.category != 'ib_wallet') {
                this.totalAccListTo.push(element);
              }
            }
            this.dropdownArray();
            this.dropdownArrayTo();
          }
        },
        (err: any) => {
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        }
      );
  }

  /***** DROPDOWN   *****/
  dropdownArray() {
    for (let index = 0; index < this.totalAccList.length; index++) {
      const element = this.totalAccList[index];
      if (index == 0) {
         this.accountListArray.push({
            title: element.type.title,
            data: [element],
          });
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
      this.transferFundsFormInfo.fromLoginSid = this.loginSid + ' ' + this.balanceAmount;
    }
    this.isLoading = false;
  }

  dropdownArrayTo() {
    for (let index = 0; index < this.totalAccListTo.length; index++) {
      const element = this.totalAccListTo[index];
      if (index == 0) {
          this.accountListArrayTo.push({
            title: element.type.title,
            data: [element],
          });
          console.log(this.accountListArrayTo)
      } else {
        for (
          let indexArray = 0;
          indexArray < this.accountListArrayTo.length;
          indexArray++
        ) {
          const item = this.accountListArrayTo[indexArray];
          console.log(item);
          if (item.title == element.type.title) {
            this.accountListArrayTo[indexArray].data.push(element);
            break;
          } else if (indexArray + 1 == this.accountListArrayTo.length) {
            this.accountListArrayTo.push({
              title: element.type.title,
              data: [element],
            });
            break;
          }
        }
      }
      this.transferFundsFormInfo.fromLoginSid = this.loginSid + ' ' + this.balanceAmount;
    }
    this.isLoading = false;
  }

  /***** SET FORM DEMO  *****/
  setForm() {
    this.transferFundsForm = this.formBuilder.group({
      fromLoginSid: [
        this.transferFundsFormInfo.fromLoginSid,
        [Validators.required],
      ],
      toLoginSid: [
        this.transferFundsFormInfo.toLoginSid,
        [Validators.required],
      ],
    });
  }

  /***** SET FORM DEMO  *****/
  setAmountForm() {
    this.transferAmountForm = this.formBuilder.group({
      amount: [
        this.transferAmountFormInfo.amount,
        [
          Validators.required,
          Validators.min(10),
          Validators.max(this.fromCurrencyValue),
        ],
      ],
    });
  }

  get f() {
    return this.transferFundsForm.controls;
  }

  get a() {
    return this.transferAmountForm.controls;
  }
  /***** CURRENCY FORMAT 1 TO 1.00   *****/
  currencyFor(val: any) {
    const value = val ? Number(val).toFixed(2) : '0.00';
    return value;
  }

  /***** FORM BACK BUTTON MANAGE   *****/
  backHandle(val: any) {
    if (val == 'hide') {
      this.bsModalService.hide();
    } else if (val == 'back') {
      this.isLoading = true;
      this.transferAccountModal = true;
      this.transferAmountModal = false;
      this.isLoading = false;
    }
  }

  /***** FORM SUBMIT  *****/
  onSubmitHandle() {
    this.isSubmitted = true;
    var fromID = this.fromLoginSidlogin;
    var toID = this.toLoginSidlogin;
    if (fromID == toID) return;
    if (this.fromCurrencyValue == '0') return;
    if (this.transferFundsForm.invalid) return;
    this.isLoading = true;
    this.setAmountForm();
    this.transferAccountModal = false;
    this.transferAmountModal = true;
    this.isSubmitted = false;
    this.isLoading = false;
  }

  /***** FORM SUBMIT SECOND FORM MANAGE (VERIFY DATA) *****/
  onSubmitVerify() {
    this.isSubmitted = true;
    if (this.transferAmountForm.invalid) return;
    this.isLoading = true;
    let body = {
      fromLoginSid: this.fromLoginSidlogin,
      toLoginSid: this.toLoginSidlogin,
      amount: Number(this.transferAmountForm.controls['amount'].value),
      currency: 'USD',
    };
    this.apiService.callApiPostRequest(API.TRANSFER_NEW, body).subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = false;
          this.transferFundRes = res;
          this.transferAmountModal = false;
          this.transferSuccessModal = true;
          this.isLoading = false;
        }
      },
      (err: any) => {
        this.isLoading = false;
        const errorMSG = err.error.message
          ? err.error.message
          : err.error.errors.children.fromLoginSid.errors
          ? err.error.errors.children.fromLoginSid.errors[0]
          : err.error.errors.children.amount.errors
          ? err.error.errors.children.amount.errors[0]
          : 'something went wrong';
        this.toastrService.error(errorMSG);
      }
    );
  }

  /***** DROPDOWN VALUE MANAGE  *****/
  selectDrop(event: any, name: any) {
    if (name == 'fromLoginSid') {
      this.fromLoginSidlogin = event.target.value.split(' ')[0];
      this.fromCurrencyValue = event.target.value.split(' ')[1];
      this.transferFundsForm.controls['fromLoginSid'].setValue(
        event.target.value
      );
    } else if (name == 'toLoginSid') {
      this.toLoginSidlogin = event.target.value.split(' ')[0];
      this.transferFundsForm.controls['toLoginSid'].setValue(
        event.target.value
      );
    }
  }

  /***** FORM SUBMIT THIRD FORM MANAGE (SUCCESS) *****/
  onSubmitSuccess() {
    this.bsModalService.hide();
    this.router.navigate([`/app/transactions-history`]);
  }
}
