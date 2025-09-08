import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';
import { DownloadCSVFileService } from 'src/app/shared/services/download-csvfile.service';

@Component({
  selector: 'app-ib-dashboard-show',
  templateUrl: './ib-dashboard-show.component.html',
  styleUrls: ['./ib-dashboard-show.component.scss']
})
export class IbDashboardShowComponent {
  @Input() userAccID: any;
  @Input() userName: any;
       

  isLoading: any = false;
  AccountsList: any = []
  id: any;
  name: any;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
    private titleService: Title,
    private downloadCSVFileService: DownloadCSVFileService,
  ) {
    // this.id = this.route.snapshot.paramMap.get('id')
  }


  ngOnInit() {
    this.commonService.setCurrentActiveLink('transactions-history');
    this.commonService.pageName = 'Transactions History';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.isLoading = true;
    this.id = this.userAccID;
    this.name = this.userName
    this.getAccountsList(this.id);
  }

  getAccountsList(id: any) {
    let body = {
      referralId: id,
      tableConfig: {
        filters: [
          {
            field: "",
            modificator: "",
            value: ""
          }
        ],
        segment: {
          limit: "1000",
          offset: 0
        },
        sorting: {
          field: "",
          direction: "DESC"
        },
        csv: false,
        withTotals: false
      }
    }
    this.apiService.callApiPostRequest(API.DASHBOARD_ACCOUNT_LIST, body).subscribe((res: any) => {
      if (res) {
        this.AccountsList = res;
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  /***** FORM BACK BUTTON MANAGE   *****/
  backHandle(val: any) {
    if (val == 'hide') {
      this.bsModalService.hide()
    }
  }

  public exportCSVFile(AccountsList: any): void {
    if (AccountsList.rows?.length > 0) {
      var ApiNameExport = API.DASHBOARD_ACCOUNT_LIST
      let body = {
        referralId: this.id,
        tableConfig: {
          filters: [
            {
              field: "",
              modificator: "",
              value: ""
            }
          ],
          segment: {
            limit: "1000",
            offset: 0
          },
          sorting: {
            field: "",
            direction: "DESC"
          },
          csv: true,
          withTotals: false
        }
      }
      this.downloadCSVFileService.downloadFile(ApiNameExport, body)
        .subscribe((response: any) => {
          if (response.status == 200 || response.ok == true) {
            this.isLoading = false;
            let fileName = 'Accounts'
            const cookies = response.headers.getAll('Set-Cookie');
            let blob: Blob = response.body as Blob;
            let a: any = document.createElement('a');
            a.download = fileName;
            a.href = window.URL.createObjectURL(blob);
            a.click();
          } else {
            this.isLoading = false;
          }
        })
    } else {
      this.isLoading = false;
      this.toastrService.error('No data found');
    }
  }
}


