
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { API } from '../../constants/constant';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../../custom-validator/confirmed.validator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-acc-change-pass-email',
  templateUrl: './acc-change-pass-email.component.html',
  styleUrls: ['./acc-change-pass-email.component.scss']
})
export class AccChangePassEmailComponent {
  public event: EventEmitter<any> = new EventEmitter();

  subscription: Subscription[] = [];
  modalRef: any;
  accountEmailLoading: any = false;
  accountPinLoading: any = false;
  data:any
  type:any;
  isSubmitted:boolean = false
  accountEmailModal: boolean = true;
  accountPinModal: boolean = false;
  accountSuccessModal:boolean = false
  AccountChangePassForm!: FormGroup;
  AccountChangePassInfo: any = {
    password: '',
    confirmPassword: '',
    pin:''
  };
  userEmail:any= ''


  constructor(
    public bsModalService: BsModalService,
    public commonService: CommonService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) {
    const userDetails = JSON.parse(localStorage.getItem('boldUserDetail') || '')
    this.userEmail = userDetails.email
  }

  ngOnInit(): void {
    this.setForm()
  }

   /***** FORM SETUP   *****/
  setForm() {
    this.AccountChangePassForm = this.formBuilder.group({
      pin: [
        this.AccountChangePassInfo.pin,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ],
      ],
      password: [
        this.AccountChangePassInfo.password,
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$')
        ],
      ],
      confirmnpassword: [
        this.AccountChangePassInfo.confirmnpassword,
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
        ],
      ],
    },
    {
      validator: ConfirmedValidator('password', 'confirmnpassword')
    }
    )
  }


  /***** FORM CONTROL  *****/
  get f() {
    return this.AccountChangePassForm.controls;
  }


  /***** CALL THIS FUNCTION FOR SEND PIN ON EMAIL    *****/
  passChangeEmail() {
    this.accountEmailLoading = true;
    let body =
    {
      action: "changeAccountPassword",
      method: "email"
    }
    this.apiService.callApiPostRequest(API.SEND_PIN, body).subscribe((res: any) => {
      if (res) {
        this.accountEmailLoading = false;
        if (res.result == true) {
          this.accountEmailModal = false;
          this.accountPinModal = true;
        } else if (res.result == false) {
          this.toastrService.error('Something went wrong');
        }
      }
    }, (err: any) => {
      this.accountEmailLoading = true;
    })
  }


  /***** CBACK BUTTON MANAGE   *****/
  backHandle() {
    this.accountPinLoading = true;
    setTimeout(() => {
      this.accountPinLoading = false;
      this.accountEmailModal = true;
      this.accountPinModal = false;
    }, 200);
  }


  /***** SEND DATA ON API   *****/
  onSubmitHandle(){
    console.log(this.data)
    console.log(this.AccountChangePassForm.controls,"this.signupForm.controls")
    this.isSubmitted = true;
    if (this.AccountChangePassForm.invalid ) return;
    this.accountPinLoading = true;
    let body = {
      loginSid: this.data,
      password: this.AccountChangePassForm.controls['password'].value,
      pin: this.AccountChangePassForm.controls['pin'].value,
      passwordType: this.type
    }

    this.apiService.callApiPostRequest(API.ACCOUNTS_CHANGE_PASSWORD, body).subscribe((res: any) => {
      if (res) {
        this.accountPinLoading = false;
        this.accountPinModal = false;
        this.accountSuccessModal = true;
      }
      this.toastrService.success('Success');

    }, (err: any) => {
      this.accountPinLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }


/***** SUCCESSFULL CHANGE PASSWORD   *****/
  accountSuccessHandle(){
    this.accountSuccessModal = false;
    this.bsModalService.hide()
  }

}
