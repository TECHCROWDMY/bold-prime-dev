import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordOtpverifyComponent } from './forgot-password-otpverify/forgot-password-otpverify.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { PaymentVerifyComponent } from './payment-verify/payment-verify.component';
import { PaymentVerifyFailedComponent } from './payment-verify-failed/payment-verify-failed.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verify-otp/:userid',
    component: VerifyOtpComponent,
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
   },
   {
    path: 'otp-verify/:email',
    component: ForgotPasswordOtpverifyComponent,
   },
   {
    path: 'reset-password/:otp',
    component: ResetPasswordComponent,
   },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'payment/processing',
    component: PaymentVerifyComponent,
  },
  {
    path: 'payment/error',
    component: PaymentVerifyFailedComponent,
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
