import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { DepositFundsComponent } from './funds/deposit-funds/deposit-funds.component';
import { WithdrawFundsComponent } from './funds/withdraw-funds/withdraw-funds.component';
import { PagesComponent } from './boldfans/pages/pages.component';
import { TransactionsHistoryFundsComponent } from './funds/transactions-history-funds/transactions-history-funds.component';
import { PaymentDetailsComponent } from './funds/payment-details/payment-details.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { MyAgreementsComponent } from './profile/my-agreements/my-agreements.component';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { PerformanceDashboardComponent } from './IBMenu/performance-dashboard/performance-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { DocumentsComponent } from './profile/documents/documents.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { ContestComponent } from './contest/contest.component';
import { IbDashboardComponent } from './IBMenu/ib-dashboard/ib-dashboard.component';
import { IbTransactionsComponent } from './IBMenu/ib-transactions/ib-transactions.component';
import { CommissionBreakdownComponent } from './IBMenu/commission-breakdown/commission-breakdown.component';
import { LinksComponent } from './IBMenu/marketing-tools/links/links.component';
import { BannersComponent } from './IBMenu/marketing-tools/banners/banners.component';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsCommissionComponent } from './IBMenu/reports/accounts-commission/accounts-commission.component';
import { ClientCommissionComponent } from './IBMenu/reports/client-commission/client-commission.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Mb4WebTraderComponent } from './mb4-web-trader/mb4-web-trader.component';
import { IbDashboardTableComponent } from './IBMenu/ib-dashboard-table/ib-dashboard-table.component';
import { EconomicCalendarComponent } from './economic-calendar/economic-calendar.component';
import { EducationalVideosComponent } from './educational-videos/educational-videos.component';
import { FirstUploadDocumentsComponent } from './first-upload-documents/first-upload-documents.component';
import { RequestIbComponent } from './IBMenu/request-ib/request-ib.component';
import { LoyaltyProgramComponent } from './boldfans/loyalty/loyalty-program/loyalty-program.component';
import { RedeemComponent } from './boldfans/loyalty/loyalty-program/redeem/redeem.component';

@NgModule({
  declarations: [
    MainComponent,
    DepositFundsComponent,
    WithdrawFundsComponent,
    TransactionsHistoryFundsComponent,
    PaymentDetailsComponent,
    ProfileComponent,
    MyAgreementsComponent,
    PerformanceDashboardComponent,
    DocumentsComponent,
    DownloadsComponent,
    ContestComponent,
    IbDashboardComponent,
    IbTransactionsComponent,
    CommissionBreakdownComponent,
    LinksComponent,
    BannersComponent,
    AccountsCommissionComponent,
    ClientCommissionComponent,
    DashboardComponent,
    Mb4WebTraderComponent,
    IbDashboardTableComponent,
    EconomicCalendarComponent,
    EconomicCalendarComponent,
    EducationalVideosComponent,
    FirstUploadDocumentsComponent,
    RequestIbComponent,
    PagesComponent,
    LoyaltyProgramComponent,
    RedeemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDropzoneModule,
    CdkAccordionModule,
    MainRoutingModule,
    BsDatepickerModule.forRoot(),
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
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
})
export class MainModule {}
