import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { API } from '../../constants/constant';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-contact-manager-admin',
  templateUrl: './contact-manager-admin.component.html',
  styleUrls: ['./contact-manager-admin.component.scss']
})
export class ContactManagerAdminComponent {


  accountLabel:any;
  accountValue:any;
  isLoading:any =false;
  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private cookie: CookieService,
    public bsModalService: BsModalService,

  ) {
    this.accountManagerDetails();

  }
  accountManagerDetails(){
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.ACCOUNT_MANAGER_DETAILS, {}).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
         for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if(index == 0){
            this.accountLabel = element.label
            this.accountValue = element.value
            break;
          }
         }
        }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');

    })
  }



}
