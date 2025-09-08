import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountChartsComponent } from './account-charts/account-charts.component';
import { AccountTraderHistoryComponent } from './account-trader-history/account-trader-history.component';
import { AccountsComponent } from './accounts.component';
import { ShowAccountComponent } from './show-account/show-account.component';
import { DemoFundComponent } from './demo-fund/demo-fund.component';


const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
  },
  {
    path: 'show/:id',
    component: ShowAccountComponent,
    data: {
      title: 'Account Details',
      description: '',
      breadcrumb: 'Account Details'
    },
  },
  {
    path: 'charts/:id',
    component: AccountChartsComponent,
    data: {
      title: 'Account Details',
      description: '',
      breadcrumb: 'Account Details'
    },
  },
  {
    path: 'tradinghistory/:id',
    component: AccountTraderHistoryComponent,
    data: {
      title: 'Account Details',
      description: '',
      breadcrumb: 'Account Details'
    },
  },
  {
    path: 'demo-fund/:id',
    component: DemoFundComponent,
    data: {
      title: 'Account Details',
      description: '',
      breadcrumb: 'Account Details'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
