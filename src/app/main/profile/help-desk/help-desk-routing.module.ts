import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpDeskViewComponent } from './help-desk-view/help-desk-view.component';
import { HelpDeskComponent } from './help-desk.component';

const routes: Routes = [
  {
    path: '',
    component: HelpDeskComponent,
  },
  {
    path: 'show/:id',
    component: HelpDeskViewComponent,
    data: {
      title: 'Help Desk Details',
      description: '',
      breadcrumb: 'Help Desk Details'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpDeskRoutingModule { }
