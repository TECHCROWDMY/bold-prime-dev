import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent {

  isLoading:any = false;
  downloadLists:any = [];

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('downloads');
    this.commonService.pageName = 'Download';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getDownloadList();
  }


  /***** DOWNLOAD APP LIST   *****/
  getDownloadList(){
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.DOWNLOADS_APP, {}).subscribe((res: any) => {
      if (res) {
        this.downloadLists = res
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }


  /***** DOWNLOAD APP    *****/
  downloadApp(item:any){
    var link = item ? item.link : ''
    window.open(link,'_blank');
  }
}
