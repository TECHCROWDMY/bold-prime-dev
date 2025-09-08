import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { ApiService } from '../shared/services/api.service';
import { API } from '../shared/constants/constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  sidebarBtn: any = false;
  isShowComp: any;
  docLists: any = [];
  userDetails: any;
  isUserVerified: any;
  profileData: any;

  constructor(
    public commonService: CommonService,
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    setInterval(() => {
      const sideBarclose = this.apiService.getSideBarStatus()
      if (sideBarclose) {
        this.sidebarBtn = false
        this.apiService.SideBarUpdateByMenu()
      }
    }, 1000);
    this.commonService.scrollToTop()
    this.getDocList();
    this.getProfileList();
    // this.userDetails = localStorage.getItem('boldUserDetail' || '')
    // var user: any = JSON.parse(this.userDetails)
    // this.isUserVerified = user.isVerified;
  }

  /***** DOCUMENT APP LIST   *****/
  getDocList() {
    this.apiService.callApiGetRequest(API.DOCUMENTS_LISTS, {}).subscribe((res: any) => {
      if (res) {
        this.docLists = res
        this.isShowComp = this.docLists?.length;
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  goToProfile() {
    this.router.navigate(['app/profile']);
  }

  sidebarHideShow() {
    this.sidebarBtn = !this.sidebarBtn
  }

  getProfileList() {
    this.apiService.callApiGetRequest(API.PROFILE, {}).subscribe((res: any) => {
      if (res) {
        this.profileData = res
        this.isUserVerified = this.profileData.isVerified;
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

}
