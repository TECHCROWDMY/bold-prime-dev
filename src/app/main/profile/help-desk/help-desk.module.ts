import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpDeskRoutingModule } from './help-desk-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { HelpDeskComponent } from './help-desk.component';
import { HelpDeskViewComponent } from './help-desk-view/help-desk-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [HelpDeskComponent, HelpDeskViewComponent],
  imports: [
    CommonModule,
    HelpDeskRoutingModule,
    SharedModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule ,
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
export class HelpDeskModule { }
