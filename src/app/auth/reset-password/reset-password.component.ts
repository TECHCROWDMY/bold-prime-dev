import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { emailValidator } from 'src/app/shared/custom-validator/email.validator';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { API } from 'src/app/shared/constants/constant';
import { ConfirmedValidator } from 'src/app/shared/custom-validator/confirmed.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {


  otpInput:any =""
  resetPassForm!: FormGroup;
  subscription: Subscription[] = [];
  isLoading: any = false;
  isSubmitted: any = false;
  passShowHide: any = true;
  resetPassFormInfo: any = {
    password: '',
    confirmnpassword: '',
  };

  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) {
    const token = localStorage.getItem('boldAccessToken')
    
      if (token) {
        this.router.navigate(['/app/dashboard']);
      }

      const otp = this.route.snapshot.paramMap.get('otp' || '')
      this.otpInput = otp ? atob(otp) : ''

  }

  ngOnInit() {
    this.setForm();
  }
  /***** PASSWORD HIDE SHOW   *****/
  togglePasswordFieldType() {
    this.passShowHide = !this.passShowHide
  }

  /***** VALIDATION FUNCTION IN HTML PAGE   *****/
  get f() {
    return this.resetPassForm.controls;
  }


  /***** LOGIN FORM- SET FORM & VALIDATION   *****/
  setForm() {
    this.resetPassForm = this.formBuilder.group({
      password: [
        this.resetPassFormInfo.password,
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
        ],
      ],
      confirmnpassword: [
        this.resetPassFormInfo.confirmnpassword,
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
    );
  }




  /***** SUBMITFORM  *****/
  onSubmit() {
        this.isSubmitted = true;
    if (this.resetPassForm.invalid) return;
    this.isLoading = true;
    let body ={
        password: {
          first: this.resetPassForm.controls['password'].value,
          second: this.resetPassForm.controls['confirmnpassword'].value,
        }
    }

     const APIName = API.FORGOT_PASSWORD + `/${this.otpInput}`
      this.apiService.callApiPostRequest(APIName,body).subscribe((res: any) => {
   
        if (res == true) {
          this.isLoading = false;
          this.toastrService.success('Your Password hHas Been Changed Successfully');
          this.router.navigate(['/login']);
      }else if (res == false) {
        this.isLoading = false;
        this.toastrService.error('Please enter valid otp');
    }
      }, (err: any) => {
     
        this.isLoading = false;
        const msg = err.error.errors.children.password.children.first.errors ? err.error.errors.children.password.children.first.errors[0] :
        err.error.errors.children.password.children.second.errors ? err.error.errors.children.password.children.second.errors[0] :
        err.error.message ? err.error.message : 'something went wrong'

        this.toastrService.error(msg);
      })


}

}
