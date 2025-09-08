import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { DemoAccountComponent } from 'src/app/shared/modals/demo-account/demo-account.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  modalRef: any;
  isLoading:boolean = false;
  accountList:any = [];
  totalAccList: any = [];
  accountListArray: any = [];
  accDetails:any = [];
  bannerList:any=[];
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private titleService: Title,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
  ) {

   }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('dashboard');
    this.commonService.pageName = 'Dashboard';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getAccountList();
    this.getBannerList();
  }


  getBannerList() {
    this.isLoading = true;
    let body = {
      tableConfig: {
        filters: [
          {
            field: "",
            modificator: "",
            value: ""
          }
        ],
        segment: {
          limit: "1000",
          offset: 0
        },
        sorting: {
          field: "",
          direction: "DESC"
        },
        csv: false,
        withTotals: false
      }
    }
    this.apiService.callApiPostRequest(API.BANNER_LIST, body).subscribe((res: any) => {
      if (res) {
        this.bannerList = res.rows;
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  getAccountList(){
    this.isLoading = true;
    this.apiService.callApiPostRequest(API.ACCOUNTS, {category: '', scope: 'all'}).subscribe((res: any) => {
      if (res) {
        this.accountList = res;
        for (let index = 0; index < res.length; index++) {
          const element = res[index]
          if (element.type.category != 'demo' ) {
            if(index == 0){
              this.selectedAccount(element.loginSid)
            }
            this.totalAccList.push(element)
          }
        }
        this.dropdownArray()
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

    /***** ON SELECT ACCOUNT DETAILS   *****/
  selectDrop(event:any) {
    let val = event.target.value
    this.getAccountDetails(val)
  }


  /***** DEFAULT ACCOUNT DETAILS   *****/
  selectedAccount(val:any){
    this.getAccountDetails(val)
  }


  /***** GET ACCOUNT DETAILS   *****/
    getAccountDetails(val:any){
      this.isLoading = true;
    var LoginSidlogin = val
    const ApiName = API.ACCOUNTS + '/' + LoginSidlogin
    this.apiService.callApiGetRequest(ApiName, {}).subscribe((res: any) => {
      if (res) {
        this.accDetails = res
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  dropdownArray() {
    for (let index = 0; index < this.totalAccList.length; index++) {
      const element = this.totalAccList[index];
      if (index == 0) {
        this.accountListArray.push({
          title: element.type.title,
          data: [element]
        })
      } else {
        for (let indexArray = 0; indexArray < this.accountListArray.length; indexArray++) {
          const item = this.accountListArray[indexArray];
          if (item.title == element.type.title) {
            this.accountListArray[indexArray].data.push(element)
            break;
          } else if ((indexArray + 1) == this.accountListArray.length) {
            this.accountListArray.push({
              title: element.type.title,
              data: [element]
            })
            break;
          }
        }
      }
    }
    this.isLoading = false;
  }


  accountOpen(type:any){
    this.modalRef = this.bsModalService.show(DemoAccountComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        types: type
     },
   });
 }

 currencyFor(val:any){
  const value =  Number(val).toFixed(2)
   return value;
 }

 accountDetails(item:any){
  if(item.loginSid){
    const loginid = item.loginSid
    this.router.navigate([`app/accounts/show/${loginid}`]);
  }
 }

 pageHandle(val:any, item:any){
  if(val == 'deposit'){
    
    if (item == 'head') {
      console.log(this.accDetails);
      const data = {
        selected: `${this.accDetails.loginSid}+${this.accDetails.balance}+${this.accDetails.type.title}+${this.accDetails.loginSid}`,
        loginId: this.accDetails.loginSid,
      };
      this.router.navigate(['app/deposit'], { queryParams: data });
      // this.router.navigate([`app/deposit`]);
    }
    else{
      console.log(item);
      const data = {
        selected: `${item.loginSid}+${item.balance}+${item.type.title}+${item.loginSid}`,
        loginId: item.loginSid,
      };
      this.router.navigate(['app/deposit'], { queryParams: data });
    }
    
    // this.router.navigate([`app/deposit`]);
  }else if(val == 'profile') {
    this.router.navigate([`app/profile`]);
  }

 }

 pageHandleView(val:any,item:any){
  if(val == 'view') {
    this.router.navigate([`app/accounts/show/${item}`]);
  }
 }



  /***** HTML DATA MANAGFE  *****/
  getDataRow(val: any, key: any) {
    var finalValue: any
    for (let index = 0; index < val.data.length; index++) {
      const element = val.data[index];
      var changeKey = element.key.replace(/,/g, " ").split("_")
      if (changeKey.indexOf("preview") >= 0 && key == 'preview') {
        const baseURL = API.DASHBOARD_IMAGE_BASE_URL
        finalValue = `${baseURL}${element.value}`
        break;
      } else if (changeKey.indexOf("size") >= 0 && key == 'size') {
        finalValue = element.value;
        break;
      } else if (changeKey.indexOf("language") >= 0 && key == 'language') {
        finalValue = element.value
        break;
      } else if (changeKey.indexOf("campaign") >= 0 && key == 'campaign') {
        finalValue = element.value
        break;
      }
    }
    return finalValue;
  }

   



}
