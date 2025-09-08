import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageInboxRoutingModule } from './message-inbox-routing.module';
import { MessageInboxComponent } from './message-inbox.component';
import { MessageShowComponent } from './message-show/message-show.component';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MessageInboxComponent,
    MessageShowComponent
  ],
  imports: [
    CommonModule,
    MessageInboxRoutingModule ,
     SharedModule,
    NgxLoaderIndicatorModule.forRoot({
      img: './assets/images/loader.gif',
      imgStyles: {
        width: '60px',
      },
      loaderStyles: {
        background: 'rgba(255, 255, 255, 0.75)',
      },
    }),
  ]
})
export class MessageInboxModule { }
