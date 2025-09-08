import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  isLoading: boolean = false;

  public pageName: any;
  sendToken: EventEmitter<any> = new EventEmitter<any>(false);

  constructor(
    public router: Router,
    private toasterService: ToastrService,
    private apiService: ApiService
  ) {}

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  validateImageFileSize(size: any) {
    let imageSizeInMb = Math.floor(size / 1024 / 1024);
    if (imageSizeInMb < 10) return true;
    else {
      this.toasterService.error('Image size should be less then 10MB');
      return false;
    }
  }

  setCurrentActiveLink(activeLink: any) {
    localStorage.setItem('activeLink', JSON.stringify(activeLink));
  }

  getCurrentActiveLink() {
    if (localStorage.getItem('activeLink') != null) {
      let activeLink = JSON.parse(localStorage.getItem('activeLink') || '');
      // console.log(activeLink, 555);
      if (activeLink !== '') {
        activeLink = activeLink.split(':')[0];
        return activeLink;
      }
    }
    return '';
  }

  getLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  getUserDetails() {
    if (this.getLocalStorage('boldUserDetail')) {
      return JSON.parse(this.getLocalStorage('boldUserDetail') || '');
    }

    return {};
  }

  checkUserLogin() {
    const userDetails = this.getUserDetails();
    return Object.keys(userDetails).length == 0 ? false : true;
  }
}
