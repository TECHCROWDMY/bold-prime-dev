import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { AccChangePassEmailComponent } from './modals/acc-change-pass-email/acc-change-pass-email.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { RouterModule } from '@angular/router';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { DemoAccountComponent } from './modals/demo-account/demo-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransferFundsComponent } from './modals/transfer-funds/transfer-funds.component';
import { CommonDeleteComponent } from './modals/common-delete/common-delete.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HelpDeskAddComponent } from './modals/help-desk-add/help-desk-add.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CopyClipboardDirective } from './directive/copy-clipboard.directive';
import { ContactManagerAdminComponent } from './modals/contact-manager-admin/contact-manager-admin.component';
import { LaverageChangeComponent } from './modals/laverage-change/laverage-change.component';
import { ProfileChangePassComponent } from './modals/profile-change-pass/profile-change-pass.component';
import { ProfileEmailChangeComponent } from './modals/profile-email-change/profile-email-change.component';
import { ProfileMobileChangeComponent } from './modals/profile-mobile-change/profile-mobile-change.component';
import { BannerGetCodeComponent } from './modals/banner-get-code/banner-get-code.component';
import { CancelWithdrawalComponent } from './modals/cancel-withdrawal/cancel-withdrawal.component';
import { LinkManageComponent } from './modals/link-manage/link-manage.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    AccChangePassEmailComponent,
    DemoAccountComponent,
    TransferFundsComponent,
    CommonDeleteComponent,
    HelpDeskAddComponent,
    CopyClipboardDirective,
    ContactManagerAdminComponent,
    LaverageChangeComponent,
    ProfileChangePassComponent,
    ProfileEmailChangeComponent,
    ProfileMobileChangeComponent,
    BannerGetCodeComponent,
    CancelWithdrawalComponent,
    LinkManageComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ModalModule.forRoot(),
    BreadcrumbComponent,
    RouterModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    BsDropdownModule.forRoot(),
    FormsModule,
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
  exports: [
    HeaderComponent,
    SidebarComponent,
    AccChangePassEmailComponent,
    DemoAccountComponent,
    TransferFundsComponent,
    HelpDeskAddComponent,
    CommonDeleteComponent,
    CopyClipboardDirective,
    ContactManagerAdminComponent,
    ProfileChangePassComponent,
    ProfileEmailChangeComponent,
    ProfileMobileChangeComponent

  ],
})
export class SharedModule { }
