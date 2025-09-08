import { Component } from '@angular/core';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { DemoAccountComponent } from 'src/app/shared/modals/demo-account/demo-account.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  category:any = 'live';
  isLoading:any = false;
  accountList:any = [];
  modalRef: any;

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
    this.commonService.setCurrentActiveLink('accounts');
    this.commonService.pageName = 'Accounts';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getAccountList();
    this.bsModalService.onHidden.subscribe(() => {
      this.getAccountList(); // Reload data when the modal closes
    });
  }

  /***** CURRENCY FORMAT 1 TO 1.00   *****/
  // currencyFor(val:any){
  //  const value =  Number(val).toFixed(2)
  //  console.log(value);
  //   return value;
  // }
  currencyFor(val: any) {
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val));

    return formattedValue;
  }

  /***** CATEGORY HANDLE ( LIVE & DEMO )   *****/
  categoryHandle(val: any) {
    this.category = val;
    this.isLoading = true;
    this.getAccountList();
  }

  /***** ACCOUNT LIST BASED ON CATEGORY   *****/
  getAccountList() {
    this.isLoading = true;
    this.apiService
      .callApiPostRequest(API.ACCOUNTS, {
        category: this.category,
        scope: 'all',
        // timestamp: new Date().getTime(), // Add a timestamp to avoid caching
      })
      .subscribe(
        (res: any) => {
          if (res) {
            this.accountList = res;
            console.log(this.accountList);
            this.isLoading = false;
          }
        },
        (err: any) => {
          this.isLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        }
      );
  }

  /***** CLICK ON VIEW PAGE OPEN   *****/

  accountShowHandle(item:any){
      if(item.loginSid){
        const loginid = item.loginSid
        this.router.navigate([`app/accounts/show/${loginid}`]);
      }
  }

  accountDepositHandle(item:any){
      if(item.loginSid){
        const loginid = item.loginSid;
        this.router.navigate(['/app/deposit'], {
          queryParams: { loginId: loginid }
        });
        // this.router.navigate([`app/deposit/?loginId=${loginid}`]);
      }
  }

    /***** MODAL OPEN DEMO AND LIVE  *****/
    accountOpen(type: any) {
      this.modalRef = this.bsModalService.show(DemoAccountComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: {
          types: type
        },
      });
    }
  }

  /***** MODAL OPEN DEMO AND LIVE  *****/
//   accountOpen(type: any) {
//     this.modalRef = this.bsModalService.show(DemoAccountComponent, {
//       animated: true,
//       backdrop: 'static',
//       class: 'modal-dialog-centered modal-lg',
//       initialState: {
//         types: type,
//       },
//     });
//     this.modalRef.onHidden.subscribe(() => {
//       // Place your action here
//       this.getAccountList();
//       // Call any method or perform any task you want after modal close
//     });
//   }
// }
