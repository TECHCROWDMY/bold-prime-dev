import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContestLeadersComponent } from './contest-leaders/contest-leaders.component';
import { ContestComponent } from './contest.component';

const routes: Routes = [
  {
    path: '',
    component: ContestComponent,
  },
  {
    path: 'show/:id',
    component: ContestLeadersComponent,
    data: {
      title: 'Contest Leaders',
      description: '',
      breadcrumb: 'Contest Leaders'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContestRoutingModule { }
