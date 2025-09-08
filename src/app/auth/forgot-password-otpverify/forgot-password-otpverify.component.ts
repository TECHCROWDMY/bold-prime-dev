import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-forgot-password-otpverify',
  templateUrl: './forgot-password-otpverify.component.html',
  styleUrls: ['./forgot-password-otpverify.component.scss']
})
export class ForgotPasswordOtpverifyComponent {

  timeLeft:any = 0;
  otpInput:any =""
  isLoading:any = false;
  emailID:any = ""

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
  }


  ngOnInit() {
    const userid = this.route.snapshot.paramMap.get('email' || '')
    this.emailID = userid ? atob(userid) : ''
    this.resetTimer()
  }

  pageHandle(){
    this.router.navigate(['/forgot-password']);
  }

  resetTimer(){
    this.timeLeft = 59;
   var downloadTimer = setInterval(()=>{
   if(this.timeLeft <= 0){
    clearInterval(downloadTimer);
   }
   if(this.timeLeft != 0){
    this.timeLeft = this.timeLeft - 1;
   }
  }, 1000);
  }

  timeFormate(val:any){
    const value = val.toString().length == 1 ? `0${val}` : val
    return value;
    }


  /***** SEND PIN ON MAIL OR TEXT  *****/
  sendPin(){
    this.isLoading = true;
    this.resetTimer();
    this.apiService.callApiPostRequest(API.FORGOT_PASSWORD,{
      email : this.emailID
    }).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.toastrService.success('OTP Sent Successfully');
    }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  /***** STORE USER OTP ON INPUT FIELD *****/
  onOtpChange(val:any){
    this.otpInput = val
  }

  /***** VERIFY OTP AND CALL API *****/
  submitOTP(){
    if(this.otpInput && this.otpInput.length != 4) return;
    this.isLoading = true;
    this.router.navigate([`/reset-password/${btoa(this.otpInput)}`]);

      // const APIName = API.FORGOT_PASSWORD + `/${this.otpInput}`
      // this.apiService.callApiPostRequest(APIName,body).subscribe((res: any) => {
      //   if (res) {
      //     this.isLoading = false;
      // }
      // }, (err: any) => {
      //   this.isLoading = false;
      //   this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
      // })
  }

}
