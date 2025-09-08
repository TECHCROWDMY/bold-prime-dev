import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LaverageChangeComponent } from 'src/app/shared/modals/laverage-change/laverage-change.component';
import { ProfileChangePassComponent } from 'src/app/shared/modals/profile-change-pass/profile-change-pass.component';
import { ProfileEmailChangeComponent } from 'src/app/shared/modals/profile-email-change/profile-email-change.component';
import { ProfileMobileChangeComponent } from 'src/app/shared/modals/profile-mobile-change/profile-mobile-change.component';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  subscription: Subscription[] = [];
  isLoading:any = false;

  profileData:any;
  notificationData:any;
  smsNotificationEnabled:any
  ibNewregister:any = false;
  paymentDetails:any = false;
  passportValue:any;
  modalRef: any;
  proofAddressValue:any
  notificationList:any = [];
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    public bsModalService: BsModalService,
    private router: Router,
    private toastrService: ToastrService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('profile');
    this.commonService.pageName = 'Profile';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getnotificationList();
    this.getDocList();
  }



 /***** DOCUMENT APP LIST   *****/
 getDocList() {
  this.isLoading = true;
  this.apiService.callApiGetRequest(API.DOCUMENTS_LISTS, {}).subscribe((res: any) => {
    if (res) {
       this.documentDataHandle(res)
      this.isLoading = false;
    }
  }, (err: any) => {
    this.isLoading = false;
    this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
  })
}




documentDataHandle(item:any){
  var documentList = item;
  for (let index = 0; index < documentList.length; index++) {
    const elementStatus = documentList[index].status
    const elementID = documentList[index].uploadConfig.title
    if(elementID=='ID/Passport'){
     this.passportValue = elementStatus
    }else {
      this.proofAddressValue = elementStatus
    }
  }
}



    /***** DATE FORMAT  *****/
  birthFormat(val:any){
    const dateformat = moment(val).format('DD/MM/YYYY')
    return dateformat ? dateformat : '';
  }

  mobileNoHandle(val:any){
    if(val){
      const mobileNumber = val.replace(/[^a-zA-Z0-9 ]/g, '');
      return mobileNumber;
    }
  }


    /***** GET USER DETAILS  *****/
  getProfileList(){
    this.apiService.callApiGetRequest(API.PROFILE, {}).subscribe((res: any) => {
      if (res) {
        this.profileData = res
        this.smsNotificationEnabled = res.smsNotificationEnabled == true ? true : false

        this.notificationData = res.notificationPreferences
        this.isLoading = false;
        if(this.notificationList){
          for (const [key, value] of Object.entries(this.notificationData)) {
            let element = {key: key}
            this.notificationList.some((item:any,index:any) =>  {
              if(item.key == element.key){
                this.notificationList[index].defaultValue = value
              }
            })
          };
        }
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  /***** GET NOTIFICATION LIST  *****/
  getnotificationList(){
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.PROFILE_NOTIFICATION_OPTIONS, {}).subscribe((res: any) => {
      if (res) {
        this.notificationList = res;
        this.getProfileList();


      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

    /***** NOTIFICATION UPDATE  *****/
  notificationUpdate(item:any){
    this.apiService.callApiPostRequest(API.PROFILE_NOTIFICATION_UPDATE, {
      preferences: [
        {
          key: item.key,
          value: !item.defaultValue
        }
      ]
    }).subscribe((res: any) => {
      if (res) {
        this.getnotificationList();
        this.toastrService.success('Success');
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  smsNotificationHandle(){
    this.smsNotificationEnabled = !this.smsNotificationEnabled;
    this.apiService.callApiPutRequest(API.PROFILE,{
        smsNotificationEnabled: this.smsNotificationEnabled
      }
    ).subscribe((res: any) => {
      if (res) {
        this.getDocList();
        this.toastrService.success('Success');
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  uploadDocument(){
    this.router.navigate(['/app/documents']);
  }


  changeEmailMobile(type:any){
    this.apiService.callApiPostRequest(API.SEND_PIN, { action: type,
          method: "email"  }).subscribe((res: any) => {
      if (res) {
        if( type == 'changeEmail'){
          this.pageHandle('email')
        }
        else if (type == 'changePhone'){
          this.pageHandle('mobile')
        }
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  pageHandle(type:any){
     if(type == 'password'){
      this.modalRef = this.bsModalService.show(ProfileChangePassComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: {
        },
      });
     }else if (type == 'email'){
      this.modalRef = this.bsModalService.show(ProfileEmailChangeComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: {
        },
      });

      const cb = this.modalRef.content.event.subscribe((data: any) => {
        if (data.isSuccess) {
          this.getProfileList()
        }
      });

      this.subscription.push(cb);

     }else if (type == 'mobile'){
      this.modalRef = this.bsModalService.show(ProfileMobileChangeComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: {
        },
      });
      const cb = this.modalRef.content.event.subscribe((data: any) => {
        if (data.isSuccess) {
          this.getProfileList()
        }
      });

      this.subscription.push(cb);

     }
  }

}
