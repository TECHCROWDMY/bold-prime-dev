import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbDashboardRoutingModule } from './ib-dashboard-routing.module';
import { IbDashboardShowComponent } from './ib-dashboard-show/ib-dashboard-show.component';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { SharedModule } from 'src/app/shared/shared.module';
import UserService from 'src/app/shared/helpers/UserService';

@NgModule({
  declarations: [IbDashboardShowComponent],
  imports: [
    CommonModule,
    IbDashboardRoutingModule,
    SharedModule,
    NgxLoaderIndicatorModule.forRoot({
      img: './assets/images/loader.gif',
      imgStyles: {
        width: '60px',
      },
      loaderStyles: {
        background: 'rgba(255, 255, 255, 0.75)',
        position: 'fixed',
        top: '0',
        left: '0',
  width: '100%',
  height: '100%',
  display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'z-index': '9999',
      },
    }),
  ],
  providers: [UserService],
})
export class IbDashboardModule {}
