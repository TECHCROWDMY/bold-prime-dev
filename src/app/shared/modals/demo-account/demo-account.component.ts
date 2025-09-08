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
  selector: 'app-demo-account',
  templateUrl: './demo-account.component.html',
  styleUrls: ['./demo-account.component.scss'],
})
export class DemoAccountComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  userEmail: any;
  accountDemoForm!: FormGroup;
  subscription: Subscription[] = [];

  DemoOpenLoading: boolean = false;
  DemoVerifyLoading: boolean = false;
  DemoOpenModal: boolean = true;
  DemoverifyModal: boolean = false;
  DemoSuccessModal: boolean = false;
  isSubmitted: boolean = false;

  types: any;
  accountTypeDemo: any = [];
  accountTypeValue: any = '';
  leveragesTypeDemo: any = [];
  addAccountRes: any;

  accountDemoFormInfo: any = {
    typeId: '',
    leverage: '',
    currency: '',
    ibId: '',
  };

  ibId: any = [
    { value: '100' },
    { value: '300' },
    { value: '500' },
    { value: '1000' },
    { value: '3000' },
    { value: '5000' },
    { value: '10000' },
    { value: '50000' },
  ];

  selectedValue: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    public bsModalService: BsModalService,
    public commonService: CommonService,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user email from local storage
    const userDetails = JSON.parse(
      localStorage.getItem('boldUserDetail') || ''
    );
    this.userEmail = userDetails.email ? userDetails.email : '';
    this.getaccountType();
    if (this.types === 'live') {
      this.setFormLive();
    } else if (this.types === 'demo') {
      this.setForm();
    }
  }

  /***** GET ACCOUNT TYPE FROM FORM VALUE  *****/
  getaccountType() {
    this.DemoOpenLoading = true;
    this.apiService.callApiGetRequest(API.ACCOUNTS_TYPE, {}).subscribe(
      (res: any) => {
        if (res) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index];
            if (element.category === this.types) {
              this.accountTypeDemo.push(element);
            }
          }
          this.DemoOpenLoading = false;
        }
      },
      (err: any) => {
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
        this.DemoOpenLoading = false;
      }
    );
  }

  /***** SET FORM LIVE  *****/
  setFormLive() {
    this.accountDemoForm = this.formBuilder.group({
      typeId: ['', [Validators.required]],
      leverage: ['', [Validators.required]],
      currency: ['', [Validators.required]],
    });
  }

  /***** SET FORM DEMO  *****/
  setForm() {
    this.accountDemoForm = this.formBuilder.group({
      typeId: ['', [Validators.required]],
      leverage: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      ibId: ['', [Validators.required]],
    });
  }

  get f() {
    return this.accountDemoForm.controls;
  }

  /***** CURRENCY FORMAT 1 TO 1.00   *****/
  currencyFor(val: any) {
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val));

    return formattedValue;
  }

  /***** FORM VALUE HANDLE   *****/
  accountTypeHandle(event: any) {
    // Get the selected value
    this.selectedValue = event.target.value;

    // Set the selected typeId value in the form
    this.accountDemoForm.controls['typeId'].setValue(this.selectedValue);

    // Reset leveragesTypeDemo to ensure it is cleared before populating
    this.leveragesTypeDemo = [];

    // Find the selected account type and update leverage options
    for (let index = 0; index < this.accountTypeDemo.length; index++) {
      const element = this.accountTypeDemo[index];
      if (element.id.toString() === this.selectedValue) {
        this.accountTypeValue = element.title;
        if (this.types === 'demo') {
          this.accountDemoForm.controls['leverage'].setValue(
            element.defaultLeverage
          );
          this.accountDemoForm.controls['currency'].setValue(
            element.initialDepositCurrency
          );
          this.accountDemoForm.controls['ibId'].setValue(
            element.initialDepositAmount.toString()
          );
          this.accountDemoForm.controls['ibId'].setValue('100');

          // Populate leveragesTypeDemo with the new leverage options
          this.leveragesTypeDemo = element.leverages ? [element.leverages] : [];
        } else if (this.types === 'live') {
          this.accountDemoForm.controls['leverage'].setValue(
            element.defaultLeverage
          );
          this.accountDemoForm.controls['currency'].setValue(
            element.initialDepositCurrency
          );

          // Populate leveragesTypeDemo with the new leverage options
          this.leveragesTypeDemo = element.leverages ? [element.leverages] : [];
        }
      }
    }
  }

  /***** FORM BACK BUTTON MANAGE   *****/
  backHandle(val: any) {
    if (val === 'hide') {
      this.bsModalService.hide();
    } else if (val === 'back') {
      this.DemoOpenModal = true;
      this.DemoverifyModal = false;
    } else if (val === 'deposit') {
      this.bsModalService.hide();
      this.router.navigate([`/app/deposit`]);
    }
  }

  /***** FORM SUBMIT FIRST FORM MANAGE (SUBMIT DATA)  *****/
  onSubmitHandle() {
    this.isSubmitted = true;

    if (this.accountDemoForm.invalid) return;
    this.DemoOpenLoading = true;
    setTimeout(() => {
      this.DemoOpenLoading = false;
      this.DemoOpenModal = false;
      this.DemoverifyModal = true;
    }, 200);
  }

  /***** FORM SUBMIT SECOND FORM MANAGE (VERIFY DATA) *****/
  onSubmitVerify() {
    this.DemoVerifyLoading = true;
    const body = {
      typeId: this.accountDemoForm.controls['typeId'].value,
      leverage: this.accountDemoForm.controls['leverage'].value,
      currency: this.accountDemoForm.controls['currency'].value,
      ibId: 0,
    };
    this.apiService.callApiPostRequest(API.ACCOUNTS_OPEN, body).subscribe(
      (res: any) => {
        if (res) {
          this.addAccountRes = res;
          if (this.types === 'demo') {
            this.openAccountDemoAmount();
          } else {
            this.DemoVerifyLoading = false;
            this.DemoverifyModal = false;
            this.DemoSuccessModal = true;
          }
        }
      },
      (err: any) => {
        if (err.error.code === 500) {
          this.DemoVerifyLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        } else {
          this.DemoVerifyLoading = false;
          this.toastrService.error(
            err.error.errors.children.typeId.errors
              ? err.error.errors.children.typeId.errors[0]
              : 'something went wrong'
          );
        }
      }
    );
  }

  /***** OPEN DEMO ACCOUNT  *****/
  openAccountDemoAmount() {
    const body = {
      loginSid: this.addAccountRes.loginSid,
      amount: this.accountDemoForm.controls['ibId'].value,
    };
    this.apiService
      .callApiPostRequest(API.ACCOUNTS_OPEN_AMOUNT, body)
      .subscribe(
        (res: any) => {
          if (res) {
            this.DemoVerifyLoading = false;
            this.DemoverifyModal = false;
            this.DemoSuccessModal = true;
          }
        },
        (err: any) => {
          if (err.error.errors) {
            this.toastrService.error(
              err.error.errors.children.typeId.errors
                ? err.error.errors.children.typeId.errors[0]
                : 'something went wrong'
            );
          } else {
            this.toastrService.error(
              err.error ? err.error.message : 'something went wrong'
            );
          }
          this.DemoVerifyLoading = false;
        }
      );
  }
  category: any = 'live';
  isLoading: any = false;
  accountList: any = [];
  getAccountList() {
    this.isLoading = true;
    this.apiService
      .callApiPostRequest(API.ACCOUNTS, {
        category: this.category,
        scope: 'all',
      })
      .subscribe(
        (res: any) => {
          if (res) {
            this.accountList = res;
            console.log(this.accountList);
            this.isLoading = false;
            //  this.bsModalService.hide();
            // this.router.navigate([`/app/accounts`]);
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
  /***** FORM SUBMIT THIRD FORM MANAGE (SUCCESS) *****/
  onSubmitSuccess() {
    this.getAccountList();
    const loginSID = this.addAccountRes.loginSid;
    // this.event.emit();
    this.bsModalService.hide();
    // this.router.navigate([`/app/accounts`]);
    // this.apiService.callApiPostRequest(API.ACCOUNTS).subscribe(
    // () => {
    //   this.bsModalService.hide();
    //   this.router.navigate([`/app/accounts`]);
    //   }
    // );
  }

  getIndentedTitle(title: string, indentLevel: number): string {
    const indent = '&nbsp;'.repeat(indentLevel * 4); // Adjust the multiplier for more or less indentation
    return `${indent}${title}`;
  }
}
