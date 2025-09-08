
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
  selector: 'app-profile-change-pass',
  templateUrl: './profile-change-pass.component.html',
  styleUrls: ['./profile-change-pass.component.scss']
})
export class ProfileChangePassComponent {
  public event: EventEmitter<any> = new EventEmitter();

  subscription: Subscription[] = [];
  modalRef: any;

  AccountChangePassForm!: FormGroup;
  AccountChangePassInfo: any = {
    oldPassword: '',
    newPassword: ''
  };
  isLoading:boolean = false
  isSubmitted:boolean = false


  constructor(
    public bsModalService: BsModalService,
    public commonService: CommonService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.setForm()
  }


   /***** FORM SETUP   *****/
   setForm() {
    this.AccountChangePassForm = this.formBuilder.group({
      oldPassword: [
        this.AccountChangePassInfo.oldPassword,
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),

        ],
      ],
      newPassword: [
        this.AccountChangePassInfo.newPassword,
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$')
        ],
      ],
    },
    )
  }

    /***** FORM CONTROL  *****/
    get f() {
      return this.AccountChangePassForm.controls;
    }


  /***** SEND DATA ON API   *****/
  onSubmitHandle(){
    this.isSubmitted = true;
   var oldPasswords= this.AccountChangePassForm.controls['oldPassword'].value
   var  newPasswords= this.AccountChangePassForm.controls['newPassword'].value
   if(oldPasswords != newPasswords){
    if (this.AccountChangePassForm.invalid ) return;
    this.isLoading = true;
    let body = {
      oldPassword: this.AccountChangePassForm.controls['oldPassword'].value,
      newPassword: this.AccountChangePassForm.controls['newPassword'].value,
    }
    this.apiService.callApiPostRequest(API.ACCOUNT_CHANGE_PASSWORD, body).subscribe((res: any) => {
      if (res) {
        console.log(res)
        this.isLoading = false;
        this.toastrService.success( 'Your Password Has Been Changed.');
        this.bsModalService.hide()

      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(
        err.error.code ?
         err.error.errors.children.oldPassword.errors ? err.error.errors.children.oldPassword.errors[0] : 
         err.error.errors.children.newPassword.errors ? err.error.errors.children.newPassword.errors[0] : 
         err.error.message : 'Something Went Wrong');
    })
  }else {
    this.toastrService.error( 'New password cannot be the same as the old password. Please choose a different password');
  }
  }
  
}
