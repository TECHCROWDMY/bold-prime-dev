import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AccChangePassEmailComponent } from 'src/app/shared/modals/acc-change-pass-email/acc-change-pass-email.component';
import { Subscription } from 'rxjs';
import { DemoAccountComponent } from 'src/app/shared/modals/demo-account/demo-account.component';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-message-show',
  templateUrl: './message-show.component.html',
  styleUrls: ['./message-show.component.scss']
})
export class MessageShowComponent {
  messageID:any = '';
  messageDetails: any;
  subscription: Subscription[] = [];
  isLoading: any = false;


  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public bsModalService: BsModalService,
    private toastrService: ToastrService,
    private titleService: Title
  ) {
    this.messageID = this.route.snapshot.paramMap.get('id')
  }


  ngOnInit() {
    this.commonService.setCurrentActiveLink('messages');
    this.commonService.pageName = 'Messages';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.isLoading = true;
    this.getMessageDetails()
  }

  getMessageDetails(){
    const ApiName = API.MESSAGE_LIST + '/' + atob(this.messageID)
    this.apiService.callApiGetRequest(ApiName, {}).subscribe((res: any) => {
      if (res) {
        this.messageDetails = res
        console.log(res)
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');

    })
  }

}
