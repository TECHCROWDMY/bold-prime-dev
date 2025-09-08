import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-first-upload-documents',
  templateUrl: './first-upload-documents.component.html',
  styleUrls: ['./first-upload-documents.component.scss']
})
export class FirstUploadDocumentsComponent {

  docLists: any = [];
  isShowComp: any = '';
  isUserVerified: any;
  profileData: any;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
    private titleService: Title
  ) {
    this.commonService.pageName = 'Upload Documents';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
  }

  ngOnInit() {
    // this.getProfileList();
  }

  goToUpload(key: any) {
    this.router.navigate(['app/documents'], { queryParams: { key: key } });
  }

  // getProfileList() {
  //   this.apiService.callApiGetRequest(API.PROFILE, {}).subscribe((res: any) => {
  //     if (res) {
  //       this.profileData = res
  //       this.isUserVerified = this.profileData.isVerified;
  //     }
  //   }, (err: any) => {
  //     this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
  //   })
  // }
}
