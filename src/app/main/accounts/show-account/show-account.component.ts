import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccChangePassEmailComponent } from 'src/app/shared/modals/acc-change-pass-email/acc-change-pass-email.component';
import { Subscription } from 'rxjs';
import { DemoAccountComponent } from 'src/app/shared/modals/demo-account/demo-account.component';
import { ToastrService } from 'ngx-toastr';
import { TransferFundsComponent } from 'src/app/shared/modals/transfer-funds/transfer-funds.component';
import { LaverageChangeComponent } from 'src/app/shared/modals/laverage-change/laverage-change.component';
import { Title } from '@angular/platform-browser';
import { formatIsoToCustomDate } from 'src/app/shared/helpers/formatIsoToCustomDate';

@Component({
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styleUrls: ['./show-account.component.scss'],
})
export class ShowAccountComponent implements OnInit, OnDestroy {
  loginSID: string = '';
  accountDetails: any;
  sendreportCheck: boolean = false;
  availableAmount: any;
  modalRef: BsModalRef | undefined;
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  formatISODate: string = '';

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public bsModalService: BsModalService,
    private toastrService: ToastrService,
    private router: Router,
    private titleService: Title
  ) {
    this.loginSID = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('accounts');
    this.commonService.pageName = 'Accounts';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.availableAmountWithdrawal();
    this.getAccountDetails();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getAccountDetails() {
    this.isLoading = true;
    const ApiName = `${API.ACCOUNTS}/${this.loginSID}`;
    this.apiService.callApiGetRequest(ApiName, {}).subscribe(
      (res: any) => {
        if (res) {
          this.accountDetails = res;
          this.formatISODate = formatIsoToCustomDate(
            this.accountDetails.createdAt,
            -5
          );
          this.isLoading = false;
          this.sendreportCheck = res.sendReports;
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'Something went wrong'
        );
      }
    );
  }

  currencyFor(val: any): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val));
  }

  availableAmountWithdrawal() {
    this.isLoading = true;
    const ApiName = `${API.ACCOUNTS}/${this.loginSID}/available-amount-for-withdrawal`;
    this.apiService.callApiGetRequest(ApiName, {}).subscribe(
      (res: any) => {
        if (res) {
          this.availableAmount = res;
          this.getAccountDetails();
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'Something went wrong'
        );
      }
    );
  }

  sendReportHandle(val: boolean) {
    this.isLoading = true;
    this.sendreportCheck = val;
    this.apiService
      .callApiPutRequest(API.ACCOUNTS_SEND_REPORT, {
        loginSid: this.loginSID,
        sendReport: this.sendreportCheck,
      })
      .subscribe(
        (res: any) => {
          if (res) {
            this.getAccountDetails();
          }
        },
        (err: any) => {
          this.isLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'Something went wrong'
          );
        }
      );
  }

  investorPassChange(type: string) {
    this.modalRef = this.bsModalService.show(AccChangePassEmailComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        data: this.loginSID,
        type: type,
      },
    });
  }

  pageManage(val: string) {
    if (val === 'deposit') {
      const data = {
        selected: `${this.loginSID}+${this.accountDetails.balance}+${this.accountDetails.type.title}+${this.accountDetails.login}`,
        loginId: this.loginSID,
      };
      this.router.navigate(['app/deposit'], { queryParams: data });
    } else if (val === 'tradinghistory') {
      this.router.navigate([`app/accounts/tradinghistory/${this.loginSID}`]);
    } else if (val === 'charts') {
      this.router.navigate([`app/accounts/charts/${this.loginSID}`]);
    } else if (val === 'demo-fund') {
      this.router.navigate([`app/accounts/demo-fund/${this.loginSID}`]);
    } else if (val === 'transfer') {
      this.modalRef = this.bsModalService.show(TransferFundsComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: {
          info: {
            loginSID: this.loginSID,
            balance: this.accountDetails.balance,
          },
        },
      });
    }
  }

  changeLeverage() {
    this.modalRef = this.bsModalService.show(LaverageChangeComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        leverageItem: {
          loginSID: this.loginSID,
          selectedLeverage: this.accountDetails?.leverage,
        },
      },
    });
    const cb = this.modalRef.content.event.subscribe((data: any) => {
      if (data.isSuccess) {
        this.getAccountDetails();
      }
    });

    this.subscriptions.push(cb);
  }
}
