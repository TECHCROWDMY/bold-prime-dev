import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent {


  otpInput:any =""
  isLoading:any = false;
  userID:any = ""
  isSubmitted:any = false;
  timeLeft:any = 0;
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
    const userid = this.route.snapshot.paramMap.get('userid' || '')
    this.userID = userid ? userid : '';
    this.resetTimer()
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
    this.apiService.callApiPostRequest(API.REGISTER_PIN,{userId : this.userID}).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
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

  pageHandle(){
    this.router.navigate(['/signup']);
  }
  /***** VERIFY OTP AND CALL API *****/
  submitOTP(){
    this.isSubmitted = true;
    if(!this.otpInput || this.otpInput.length != 4) return;
    let body = {
      userId : Number(this.userID),
      pin : this.otpInput
    }
      this.isLoading = true;
      this.apiService.callApiPostRequest(API.REGISTER_CONFIRM_PIN,body).subscribe((res: any) => {
        if (res) {
         
          this.isLoading = false;
          this.toastrService.success('Activation Successful');
          this.router.navigate(['/login']);

      }
      }, (err: any) => {
        this.isLoading = false;
        this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
      })
  }

}
