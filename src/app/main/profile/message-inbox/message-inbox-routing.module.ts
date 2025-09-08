import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageInboxComponent } from './message-inbox.component';
import { MessageShowComponent } from './message-show/message-show.component';

const routes: Routes = [
  {
    path: '',
    component: MessageInboxComponent,
  },
  {
    path: 'inbox/:id',
    component: MessageShowComponent,
    data: {
      title: 'Message Details',
      description: '',
      breadcrumb: 'Message Details'
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageInboxRoutingModule { }
