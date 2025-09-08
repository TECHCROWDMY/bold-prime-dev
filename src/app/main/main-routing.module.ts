import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContestComponent } from './contest/contest.component';
import { EconomicCalendarComponent } from './economic-calendar/economic-calendar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { DepositFundsComponent } from './funds/deposit-funds/deposit-funds.component';
import { PaymentDetailsComponent } from './funds/payment-details/payment-details.component';
import { TransactionsHistoryFundsComponent } from './funds/transactions-history-funds/transactions-history-funds.component';
import { WithdrawFundsComponent } from './funds/withdraw-funds/withdraw-funds.component';
import { CommissionBreakdownComponent } from './IBMenu/commission-breakdown/commission-breakdown.component';
import { IbDashboardTableComponent } from './IBMenu/ib-dashboard-table/ib-dashboard-table.component';
import { IbDashboardComponent } from './IBMenu/ib-dashboard/ib-dashboard.component';
import { IbTransactionsComponent } from './IBMenu/ib-transactions/ib-transactions.component';
import { BannersComponent } from './IBMenu/marketing-tools/banners/banners.component';
import { LinksComponent } from './IBMenu/marketing-tools/links/links.component';
import { PerformanceDashboardComponent } from './IBMenu/performance-dashboard/performance-dashboard.component';
import { AccountsCommissionComponent } from './IBMenu/reports/accounts-commission/accounts-commission.component';
import { ClientCommissionComponent } from './IBMenu/reports/client-commission/client-commission.component';
import { MainComponent } from './main.component';
import { Mb4WebTraderComponent } from './mb4-web-trader/mb4-web-trader.component';
import { DocumentsComponent } from './profile/documents/documents.component';
import { MyAgreementsComponent } from './profile/my-agreements/my-agreements.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { EducationalVideosComponent } from './educational-videos/educational-videos.component';
import { FirstUploadDocumentsComponent } from './first-upload-documents/first-upload-documents.component';
import { RequestIbComponent } from './IBMenu/request-ib/request-ib.component';
import { PagesComponent } from './boldfans/pages/pages.component';
import { LoyaltyProgramComponent } from './boldfans/loyalty/loyalty-program/loyalty-program.component';
import { RedeemComponent } from './boldfans/loyalty/loyalty-program/redeem/redeem.component'; 

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      title: 'Home',
      description: '',
      breadcrumb: 'Home',
    },
    children: [
      {
        path: 'mb4webtrader',
        component: Mb4WebTraderComponent,
        data: {
          title: 'mb4 Web Trader',
          description: '',
          breadcrumb: 'mb4 Web Trader',
        },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          description: '',
          breadcrumb: 'Dashboard',
        },
      },
      /***** ACCOUNTS  *****/
      {
        path: 'accounts',
        loadChildren: () =>
          import('src/app/main/accounts/accounts.module').then(
            (m) => m.AccountsModule
          ),
        data: {
          title: 'Accounts',
          description: '',
          breadcrumb: 'Accounts',
        },
      },

      /***** FUNDS  *****/
      {
        path: 'deposit',
        component: DepositFundsComponent,
        data: {
          title: 'Deposit',
          description: '',
          breadcrumb: 'Deposit',
        },
      },
      {
        path: 'withdraw',
        component: WithdrawFundsComponent,
        data: {
          title: 'Withdraw',
          description: '',
          breadcrumb: 'Withdraw',
        },
      },
      {
        path: 'transactions-history',
        component: TransactionsHistoryFundsComponent,
        data: {
          title: 'Transactions History',
          description: '',
          breadcrumb: 'Transactions History',
        },
      },
      {
        path: 'wallets',
        component: PaymentDetailsComponent,
        data: {
          title: 'Wallets',
          description: '',
          breadcrumb: 'Wallets',
        },
      },

      /***** Bold Prime Fans Program  *****/
      {
        path: 'pages/31',
        component: PagesComponent,
        data: {
          title: 'Pages',
          description: '',
          breadcrumb: 'Pages',
        },
      },
      {
        path: 'loyalty/loyalty-program',
        component: LoyaltyProgramComponent,
        data: {
          title: 'Loyalty Program',
          description: '',
          breadcrumb: 'Loyalty Program',
        },
      },
      {
        path: 'loyalty/loyalty-program/redeem',
        component: RedeemComponent,
        data: {
          title: 'Redeem',
          description: '',
          breadcrumb: 'Redeem',
        },
      },

      /***** DOWNLOADS  *****/

      {
        path: 'downloads',
        component: DownloadsComponent,
        data: {
          title: 'Downloads',
          description: '',
          breadcrumb: 'Downloads',
        },
      },
      /***** CONTEST  *****/

      {
        path: 'contest',
        loadChildren: () =>
          import('src/app/main/contest/contest.module').then(
            (m) => m.ContestModule
          ),
        data: {
          title: 'Contest',
          description: '',
          breadcrumb: 'Contest',
        },
      },

      {
        path: 'economic-calendar',
        component: EconomicCalendarComponent,
        data: {
          title: 'Economic Calendar',
          description: '',
          breadcrumb: 'Economic Calendar',
        },
      },

      {
        path: 'educational-videos',
        component: EducationalVideosComponent,
        data: {
          title: 'Educational Videos',
          description: '',
          breadcrumb: 'Educational Videos',
        },
      },

      {
        path: 'upload-documents',
        component: FirstUploadDocumentsComponent,
        data: {
          title: '',
          description: '',
          breadcrumb: '',
        },
      },

      /***** PROFILE  *****/
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile',
          description: '',
          breadcrumb: 'Profile',
        },
      },
      {
        path: 'help-desk',
        loadChildren: () =>
          import('src/app/main/profile/help-desk/help-desk.module').then(
            (m) => m.HelpDeskModule
          ),
        data: {
          title: 'Help Desk',
          description: '',
          breadcrumb: 'Help Desk',
        },
      },
      {
        path: 'my-agreement',
        component: MyAgreementsComponent,
        data: {
          title: 'My Agreement',
          description: '',
          breadcrumb: 'My Agreement',
        },
      },
      {
        path: 'documents',
        component: DocumentsComponent,
        data: {
          title: 'Upload New Documents',
          description: '',
          breadcrumb: 'Upload New Documents',
        },
      },
      {
        path: 'messages',
        loadChildren: () =>
          import(
            'src/app/main/profile/message-inbox/message-inbox.module'
          ).then((m) => m.MessageInboxModule),
        data: {
          title: 'Messages',
          description: '',
          breadcrumb: 'Messages',
        },
      },

      /***** IB MENU   *****/
      {
        path: 'ib-dashboard',
        loadChildren: () =>
          import('src/app/main/IBMenu/ib-dashboard/ib-dashboard.module').then(
            (m) => m.IbDashboardModule
          ),
        data: {
          title: 'Dashboard',
          description: '',
          breadcrumb: 'Dashboard',
        },
      },

      {
        path: 'detailed-commission-breakdown',
        component: CommissionBreakdownComponent,
        data: {
          title: 'Detailed Commission Breakdown',
          description: '',
          breadcrumb: 'Detailed Commission Breakdown',
        },
      },
      {
        path: 'dashboard-referrals',
        component: IbDashboardTableComponent,
        data: {
          title: 'Dashboard Referrals',
          description: '',
          breadcrumb: 'Dashboard Referrals',
        },
      },

      {
        path: 'ib-transactions',
        component: IbTransactionsComponent,
        data: {
          title: 'IB Transactions',
          description: '',
          breadcrumb: 'IB Transactions',
        },
      },
      {
        path: 'request-ib',
        component: RequestIbComponent,
        data: {
          title: 'Request IB',
          description: '',
          breadcrumb: 'Request IB',
        },
      },
      {
        path: 'performance-dashboard',
        component: PerformanceDashboardComponent,
        data: {
          title: 'Performance Dashboard',
          description: '',
          breadcrumb: 'Performance Dashboard',
        },
      },

      /***** REPORTS   *****/

      {
        path: 'account-commission',
        component: AccountsCommissionComponent,
        data: {
          title: 'Account Commission',
          description: '',
          breadcrumb: 'Account Commission',
        },
      },
      {
        path: 'client-commission',
        component: ClientCommissionComponent,
        data: {
          title: 'Client Commission',
          description: '',
          breadcrumb: 'Client Commission',
        },
      },

      /***** MARKETING TOOLS   *****/

      {
        path: 'links',
        component: LinksComponent,
        data: {
          title: 'Links',
          description: '',
          breadcrumb: 'Links',
        },
      },
      {
        path: 'banners',
        component: BannersComponent,
        data: {
          title: 'Banners',
          description: '',
          breadcrumb: 'Banners',
        },
      },

      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
