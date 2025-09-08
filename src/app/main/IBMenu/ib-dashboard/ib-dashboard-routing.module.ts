import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IbDashboardShowComponent } from './ib-dashboard-show/ib-dashboard-show.component';
import { IbDashboardComponent } from './ib-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: IbDashboardComponent,
  },
  {
    path: 'show/:id',
    component: IbDashboardShowComponent,
    data: {
      title: 'Accounts',
      description: '',
      breadcrumb: 'Accounts'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IbDashboardRoutingModule { }
