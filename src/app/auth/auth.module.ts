import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { SignupComponent } from './signup/signup.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordOtpverifyComponent } from './forgot-password-otpverify/forgot-password-otpverify.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaymentVerifyComponent } from './payment-verify/payment-verify.component';
import { PaymentVerifyFailedComponent } from './payment-verify-failed/payment-verify-failed.component';

// import { SocialLoginModule } from 'angularx-social-login';
// import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider  } from 'angularx-social-login';

// const config = new AuthServiceConfig([
  // {
  //   id: GoogleLoginProvider.PROVIDER_ID,
  //   provider: new GoogleLoginProvider('528961187921-ld24b25466u4t2lacn9r35asg000lfis.apps.googleusercontent.com')
  // },
  // {
  //   id: FacebookLoginProvider.PROVIDER_ID,
  //   provider: new FacebookLoginProvider('561602290896109')
  // },
  // {
  //   id: LinkedInLoginProvider.PROVIDER_ID,
  //   provider: new LinkedInLoginProvider("78iqy5cu2e1fgr")
  // }
// ])


// export function provideConfig() {
//   return config;
// }

@NgModule({
  declarations: [
    AuthComponent,
    VerifyOtpComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignupComponent,
    ResetPasswordComponent,
    ForgotPasswordOtpverifyComponent,
    PaymentVerifyComponent,
    PaymentVerifyFailedComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    NgOtpInputModule,
    // SocialLoginModule,
    BsDatepickerModule.forRoot(),
    NgxCaptchaModule,
    ReactiveFormsModule,
    NgxLoaderIndicatorModule.forRoot({
      img: './assets/images/loader.gif',
      imgStyles: {
        width: '60px',
      },
      loaderStyles: {
        background: 'rgba(255, 255, 255, 0.75)',
      },
    }),
  ],
  // providers: [
  //   {
  //     provide: AuthServiceConfig,
  //     useFactory: provideConfig
  //   }
  // ],
})
export class AuthModule { }
