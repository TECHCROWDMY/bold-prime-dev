import { Component } from '@angular/core';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-message-inbox',
  templateUrl: './message-inbox.component.html',
  styleUrls: ['./message-inbox.component.scss'],
})
export class MessageInboxComponent {
  isLoading: any = false;
  messageList: any = [];
  messageCounts: any = [];
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.commonService.setCurrentActiveLink('messages');
    this.commonService.pageName = 'Messages';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.getMessageList();
  }

  /***** ACCOUNT LIST BASED ON CATEGORY   *****/
  getMessageList() {
    let body = {
      tableConfig: {
        filters: [
          {
            field: '',
            modificator: '',
            value: '',
          },
        ],
        segment: {
          limit: 20,
          offset: 0,
        },
        sorting: {
          field: '',
          direction: 'DESC',
        },
        csv: false,
        withTotals: false,
      },
    };
    this.isLoading = true;
    this.apiService.callApiPostRequest(API.MESSAGE_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          this.messageList = res;
          this.isLoading = false;
          var messageCount = 0;
          if (res?.rows && res?.rows?.length > 0) {
            res.rows.map((item: any) => {
              if (item.data[4].value == 0) {
                messageCount = messageCount + 1;
              }
              return item;
            });
            this.messageCounts = messageCount;
            localStorage.setItem('messageCount', this.messageCounts);
          }

          console.log(res);
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }
  pageHandle(val: any) {
    this.router.navigate([`app/messages/inbox/${btoa(val)}`]);
  }
}
