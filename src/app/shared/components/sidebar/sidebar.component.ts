import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { API } from '../../constants/constant';
import { ContactManagerAdminComponent } from '../../modals/contact-manager-admin/contact-manager-admin.component';
import { DemoAccountComponent } from '../../modals/demo-account/demo-account.component';
import { TransferFundsComponent } from '../../modals/transfer-funds/transfer-funds.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  profileHideShow: any = false;
  current = '';
  modalRef: any;
  profileName: any;
  ibManu: any = true;
  finalValue: any = false;
  loginSid: any;
  Amount = 0;
  overAllAmount: any;
  userDetails: any;
  messageCounts: any = 0;
  boldUser: any;
  clietId: any;
  userName: any;
  level: any;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    public bsModalService: BsModalService,
    private toastrService: ToastrService
  ) {
    this.getMessageList();
    this.userDetails = localStorage.getItem('boldUserDetail' || '');
    var user: any = JSON.parse(this.userDetails);

    const fNames = user?.firstName.split('')[0]
      ? user.firstName.split('')[0]
      : '';
    const Lnames = user?.lastName.split('')[0]
      ? user.lastName.split('')[0]
      : '';
    this.profileName = fNames + Lnames;
    this.clietId = user?.id;
    this.userName = user?.firstName + ' ' + user?.lastName;

    if (user.isIb == true) {
      this.ibManu = true;
    } else {
      this.ibManu = false;
    }
  }

  ngOnInit() {
    this.contactManager();
    this.getAccountDetails('live');
    this.getAccountDetails('ib_wallet');
    setInterval(() => {
      this.messageCounts = localStorage.getItem('messageCount' || 0);
    }, 1000);

    var user: any = JSON.parse(this.userDetails);
    if (user.isIb == true) {
      this.ibManu = true;
    } else {
      this.ibManu = false;
    }
  }

  profileHandle() {
    this.profileHideShow = true;
  }

  depositHandle() {
    this.router.navigate(['app/deposit']);
  }
  /***** ACCOUNT LIST BASED ON CATEGORY   *****/
  getMessageList() {
    let body = {
      tableConfig: {
        filters: [
          {
            field: '',
            modificator: '',
            value: '',
          },
        ],
        segment: {
          limit: 20,
          offset: 0,
        },
        sorting: {
          field: '',
          direction: 'DESC',
        },
        csv: false,
        withTotals: false,
      },
    };
    this.apiService.callApiPostRequest(API.MESSAGE_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          var messageCount = 0;
          if (res?.rows && res?.rows?.length > 0) {
            res.rows.map((item: any) => {
              if (item.data[4].value == 0) {
                messageCount = messageCount + 1;
              }
              return item;
            });
          }
          this.messageCounts = messageCount;
          localStorage.setItem('messageCount', this.messageCounts);
        }
      },
      (err: any) => {}
    );
  }
  getAccountDetails(type: any) {
    let body = {
      category: type,
    };
    this.apiService.callApiPostRequest(API.ACCOUNTS, body).subscribe(
      (res: any) => {
        if (res?.length > 0) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index].balance;
            this.Amount = this.Amount + Number(element);
          }

          const finalAmount = this.Amount
            ? this.Amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
            : 0;

          this.overAllAmount = finalAmount;
        } else {
          this.overAllAmount = 0;
        }

        if (this.Amount >= 8001) {
          this.level = 'Platinum';
        } else if (this.Amount <= 2000) {
          this.level = 'Bronze';
        } else if (this.Amount <= 5000) {
          this.level = 'Silver';
        } else if (this.Amount <= 8000) {
          this.level = 'Gold';
        }
      },
      (err: any) => {
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  contactManager() {
    this.apiService
      .callApiGetRequest(API.ACCOUNT_MANAGER_DETAILS, {})
      .subscribe((res: any) => {
        if (res) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index];
            if (index == 0) {
              if (element.value != '') {
                this.finalValue = true;
              }
              break;
            }
          }
        }
      });
  }

  openSidenavItemAccess(item: any, route: any) {
    var user: any = JSON.parse(this.userDetails);
    const userAccess = user?.financialPermissions?.find((x: any) => x == item);
    if (!userAccess) {
      this.toastrService.error('This operation is not allowed');
    } else {
      if (userAccess == 'transfer') {
        this.modalRef = this.bsModalService.show(TransferFundsComponent, {
          animated: true,
          backdrop: 'static',
          class: 'modal-dialog-centered modal-lg',
          initialState: {},
        });
      } else {
        this.current == item;
        this.commonService.setCurrentActiveLink(item);
        this.router.navigate([route]);
        this.apiService.SideBarUpdateByMenu();
      }
    }
  }
  /***** SIDEBAR OPEN  *****/
  openSidenavItem(item: any, route: any) {
    this.current == item;
    console.log(this.current);
    this.commonService.setCurrentActiveLink(item);

    if (route !== null) {
      const splitterRoute = route.split(':');

      if (splitterRoute[1] && route !== null) {
        this.router.navigate([splitterRoute[0], { state: splitterRoute[1] }]);
        this.apiService.updateSideBarStatus();
      } else if (!splitterRoute[1] && route !== null) {
        this.router.navigate([splitterRoute[0]]);
        this.apiService.SideBarUpdateByMenu();
      }
    }
    if (item === 'bannerNav') {
      this.collapseBanners();
      return;
    } else if (item === 'instructionNav') {
      this.collapseInstructions();
      return;
    } else if (item.slice(0, 6) === 'banner') {
      this.collapseCloseAll();
      return;
    } else {
      this.collapseCloseAll();
      return;
    }
  }

  collapseInstructionToggle: boolean = false;
  collapseBannersToggle: boolean = false;
  collapseBanners() {
    this.collapseBannersToggle = !this.collapseBannersToggle;
    this.collapseInstructionToggle = false;
  }

  collapseInstructions() {
    this.collapseInstructionToggle = !this.collapseInstructionToggle;
    this.collapseBannersToggle = false;
  }

  collapseCloseAll() {
    this.collapseInstructionToggle = false;
    this.collapseBannersToggle = false;
  }

  /***** MODAL OPEN DEMO AND LIVE  *****/
  accountOpen(type: any) {
    this.modalRef = this.bsModalService.show(DemoAccountComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        types: type,
      },
    });
  }

  accountManage() {
    this.modalRef = this.bsModalService.show(ContactManagerAdminComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {},
    });
  }

  /***** LOGOUT USER  *****/
  logoutUser() {
    this.apiService.callApiPostRequest(API.LOGOUT, {}).subscribe();
    localStorage.clear();
    this.router.navigate([`login`]);
  }

  /***** OPEN TRANSCATION FUNDS MODAL  *****/
}
