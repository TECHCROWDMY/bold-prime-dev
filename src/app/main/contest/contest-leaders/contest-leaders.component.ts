import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-contest-leaders',
  templateUrl: './contest-leaders.component.html',
  styleUrls: ['./contest-leaders.component.scss']
})
export class ContestLeadersComponent {
  isLoading:any = false;
  contesetLeaderList :any = [];
 id:any
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private titleService: Title
  ) {
    this.id = this.route.snapshot.paramMap.get('id')
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('contest');
    this.commonService.pageName = 'Contest';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.isLoading = true;
    this.getContesLeadertList()
  }

    /***** GET ACCOUNT DETAILS   *****/
    getContesLeadertList() {
      const ApiName = API.CONTEST_COMMON + '/' + this.id + '/' + 'leaders'
      this.apiService.callApiGetRequest(ApiName, {}).subscribe((res: any) => {
        if (res) {
          this.contesetLeaderList = res
          this.isLoading = false;
        }
      }, (err: any) => {
        this.isLoading = false;
        this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');

      })
    }
}
