import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { ShowAccountComponent } from './show-account/show-account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { AccountTraderHistoryComponent } from './account-trader-history/account-trader-history.component';
import { AccountChartsComponent } from './account-charts/account-charts.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DemoFundComponent } from './demo-fund/demo-fund.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccountsComponent,
    ShowAccountComponent,
    AccountTraderHistoryComponent,
    AccountChartsComponent,
    DemoFundComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AccountsRoutingModule,
    SharedModule,
    NgxDropzoneModule,
    CdkAccordionModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
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
export class AccountsModule {}
