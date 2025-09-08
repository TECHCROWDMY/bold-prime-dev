
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/shared/custom-validator/email.validator';
import { ApiService } from 'src/app/shared/services/api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { API } from 'src/app/shared/constants/constant';
import { ConfirmedValidator } from 'src/app/shared/custom-validator/confirmed.validator';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPassForm!: FormGroup;
  subscription: Subscription[] = [];
  isLoading:any = false;
  isSubmitted:any = false;
  forgotPassFormInfo:any = {
    email: '',
  };

  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private cookie: CookieService,
    private titleService: Title
  ) {
    const token = localStorage.getItem('boldAccessToken')
      if (token) {
        this.router.navigate(['/app/dashboard']);
      }
  }

/***** NGONINIT   *****/
ngOnInit() {
  this.setForm();
  this.commonService.pageName = 'Forgot Password';
  this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
}


  /***** VALIDATION FUNCTION IN HTML PAGE   *****/
  get f() {
    return this.forgotPassForm.controls;
  }
 /***** LOGIN FORM- SET FORM & VALIDATION   *****/
 setForm() {
  this.forgotPassForm = this.formBuilder.group({
    email: [
      this.forgotPassFormInfo.email,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        emailValidator,
      ],
    ],

  });
}


  /***** SUBMITFORM  *****/
  onSubmit() {
    this.isSubmitted = true;
    if (this.forgotPassForm.invalid) return;
    this.isLoading = true;
    localStorage.clear();
    let body = {
      email: this.forgotPassForm.controls['email'].value,
    }

    this.apiService.callApiPostRequest(API.FORGOT_PASSWORD, body).subscribe((res: any) => {
      if (res) {
     
        this.isSubmitted = false;
        this.isLoading = false;
        var email = this.forgotPassForm.controls['email'].value ? this.forgotPassForm.controls['email'].value : 'bold@yopmail.com'
        this.router.navigate([`/otp-verify/${btoa(email)}`]);
      }
    }, (err: any) => {
      this.isSubmitted = false;
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  pageHandle(val:any){
    this.router.navigate(['/login'])
  }

}
