
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


@Component({
  selector: 'app-my-agreements',
  templateUrl: './my-agreements.component.html',
  styleUrls: ['./my-agreements.component.scss']
})
export class MyAgreementsComponent {

  isLoading:any = false;
  docList:any = [];
  docListUpdate:any = [];
  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private cookie: CookieService,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('my-agreement');
    this.commonService.pageName = 'My Agreement';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getAgrrementDoc();
    this.getAgrrementDocType();

  }

  getAgrrementDoc(){
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.AGGREMENT_DOCUMENT, {}).subscribe((res: any) => {
      if (res) {
        console.log(res)
        this.docList = res
      this.isLoading = false;

        }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');

    })
  }
  getAgrrementDocType(){
    this.isLoading = true;
    let body = { acceptIn: "" }
    this.apiService.callApiPostRequest(API.AGGREMENT_DOCUMENT_TYPE, body).subscribe((res: any) => {
      if (res) {
        this.docListUpdate = res
        this.isLoading = false;

        }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');

    })
  }
  downloadDoc(item:any ){
  //  var  pdfPath = item.path ? API.IMAGE_BASE_URL + item.path : ''
  if(item == '1'){
    window.open('https://myboldprime.com/client-agreements/');
  } else if(item == '2'){
    window.open('https://myboldprime.com/aml-kyc-policy/');  
  }else if(item == '3'){
    window.open('https://myboldprime.com/terms-and-conditions/'); 
  }

  //  if(item.path){
  //    window.open(pdfPath);
  //   }else {
  //     this.toastrService.error('data not found');

  //   }
  }

}
