import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { API } from 'src/app/shared/constants/constant';
import { HelpDeskAddComponent } from 'src/app/shared/modals/help-desk-add/help-desk-add.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-help-desk',
  templateUrl: './help-desk.component.html',
  styleUrls: ['./help-desk.component.scss']
})
export class HelpDeskComponent {
  category:any = 'open';
  isLoading:any = false;
  helpDeskList:any = []
  modalRef: any;
  subscription: Subscription[] = [];
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    public bsModalService: BsModalService,
    private toastrService: ToastrService,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('help-desk');
    this.commonService.pageName = 'Help Desk';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getHelpDeskOpenList()
  }

  getHelpDeskOpenList(){
    this.isLoading = true
    this.apiService.callApiGetRequest(API.HELP_DESK_GET_OPEN , {}).subscribe((res: any) => {
      if (res) {
        console.log(res)
        this.helpDeskList = res;
       this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  getHelpDeskCloseList(){
    this.apiService.callApiGetRequest(API.HELP_DESK_GET_CLOSED, {}).subscribe((res: any) => {
      if (res) {
        console.log(res)
        this.helpDeskList = res;
       this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  categoryHandle(val:any){
    this.category = val
    this.isLoading = true;
    if(val == 'open'){this.getHelpDeskOpenList()}
    else if(val == 'close'){this.getHelpDeskCloseList()}
  }

  helpDeskView(item:any){
    this.router.navigate([`/app/help-desk/show/${item.id}`]);
  }

  dateFormate(val: any) {
    if (val) {
      let date = moment(val).format("DD-MM-YYYY, h:mm");
      return date;
    } else {
      return ''
    }
  }
  openHelpDesk(){
      this.modalRef = this.bsModalService.show(HelpDeskAddComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: {
       },
     });

     const cb = this.modalRef.content.event.subscribe((data: any) => {
      if (data.isSuccess) {
        this.getHelpDeskOpenList();
      }
    });

    this.subscription.push(cb);


  }
}
