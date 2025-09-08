
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
import { Title } from '@angular/platform-browser';

// import { AuthService } from 'angularx-social-login';
// import { SocialUser } from 'angularx-social-login';
// import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  subscription: Subscription[] = [];
  isLoading: any = false;
  isSubmitted: any = false;
  passShowHide: any = true;
  loginFormInfo: any = {
    email: '',
    password: '',
    rememberMe: false
  };
  docLists: any;
  isShowComp: any;

  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private cookie: CookieService,
    private titleService: Title
    // private authService: AuthService
  ) {
    const token = localStorage.getItem('boldAccessToken')

    if (token) {
      this.router.navigate(['/app/dashboard']);
    }
  }


  /***** NGONINIT   *****/
  ngOnInit() {
    this.commonService.pageName = 'Sign In';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.setForm();
    if (this.cookie.get('boldEmail')) {
      this.isLoading = true;
      this.getCookie()
    } else {
      this.loginForm.controls['rememberMe'].setValue(false)
    }
  }

  /***** PASSWORD HIDE SHOW   *****/
  togglePasswordFieldType() {
    this.passShowHide = !this.passShowHide
  }

  /***** VALIDATION FUNCTION IN HTML PAGE   *****/
  get f() {
    return this.loginForm.controls;
  }

  /***** REMEMBER ME - SET COOKIE   *****/
  setCookie(data: any) {
    const email = btoa(data.email)
    const password = btoa(data.password)
    this.cookie.set('boldEmail', email)
    this.cookie.set('boldPassword', password)
  }

  /***** REMEMBER ME - REMOVE COOKIE   *****/
  removeCookie() {
    this.cookie.deleteAll();
  }

  /***** REMEMBER ME - GET COOKIE   *****/
  getCookie() {
    const email = this.cookie.get('boldEmail')
    const password = this.cookie.get('boldPassword')
    this.loginForm.controls['email'].setValue(atob(email))
    this.loginForm.controls['password'].setValue(atob(password))
    this.loginForm.controls['rememberMe'].setValue(true)
    this.isLoading = false;

  }

  /***** LOGIN FORM- SET FORM & VALIDATION   *****/
  setForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        this.loginFormInfo.email,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          emailValidator,
        ],
      ],
      password: [
        this.loginFormInfo.password,
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
        ],
      ],
      rememberMe: []
    });
  }

  /***** SUBMITFORM  *****/
  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    localStorage.clear();
    let body = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
      rememberMe: this.loginForm.controls['rememberMe'].value
    }

    this.apiService.callApiPostRequest(API.LOGIN, body).subscribe((res: any) => {
      if (res) {
        if (body.rememberMe) {
          this.setCookie(body)
        } else {
          this.removeCookie()
        }
        this.isSubmitted = false;
        this.isLoading = false;
        localStorage.setItem('boldAccessToken', res.accessToken);
        localStorage.setItem('boldUserDetail', JSON.stringify(res.client));

        this.getDocList().subscribe((docLists: any) => {
          if (docLists) {
            this.docLists = docLists;
            if (docLists?.length > 0) {
              this.router.navigate(['/app/dashboard']);
            } else {
              this.router.navigate(['/app/upload-documents']);
            }
          }
        }, (err: any) => {
          this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
        });

      }
    }, (err: any) => {
      this.isSubmitted = false;
      this.isLoading = false;

      this.toastrService.error(err.error.message == 'Bad credentials.' ? 'Invalid Email Id or Password' : err.error.message ? err.error.message : 'something went wrong');

    })
  }

  pageHandle(val: any) {
    if (val == 'forgot') {
      this.router.navigate(['/forgot-password']);
    } else if (val == 'signup') {
      this.router.navigate(['/signup']);
    }

  }

  getDocList() {
    return this.apiService.callApiGetRequest(API.DOCUMENTS_LISTS, {});
  }
}
