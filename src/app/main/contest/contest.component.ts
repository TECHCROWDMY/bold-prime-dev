import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.scss']
})
export class ContestComponent {

  isLoading:any = false;
  contesetList :any = [];

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('contest');
    this.commonService.pageName = 'Contest';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.isLoading = true;
    this.getContestList()
  }


  /***** CONTEST LIST   *****/
  getContestList(){
    this.apiService.callApiGetRequest(API.CONTEST_LIST , {}).subscribe((res: any) => {
      if (res) {
       this.contesetList = res ;
       this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  /***** CONTEST PARTICIPATE AND LEADERS *****/
  submitHandle(val:any, id:any){
    const ApiName  = API.CONTEST_COMMON + '/' + id + '/' + val
    this.apiService.callApiPostRequest(ApiName , {}).subscribe((res: any) => {
      if (res) {
        var loginSID = res.loginSid
        this.getContestList();
        this.isLoading = false;
        if(val == 'participate'){
          this.router.navigate([`app/accounts/show/${loginSID}`]);
        }
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }
  /***** CONTEST PARTICIPATE BUTTON VALIDATION *****/
  particiapteMangae(item:any){
    const date = new Date()
    var registerFrom = item.registrationPeriodFrom ? item.registrationPeriodFrom : date
    var registerTo = item.registrationPeriodTo ? item.registrationPeriodTo  : date
    const currentDate = moment(date).format("DD-MM-YYYY");
    const registerFromDate = moment(registerFrom).format("DD-MM-YYYY");
    const registerToDate = moment(registerTo).format("DD-MM-YYYY");
    const canParticipate = item.canParticipate ? item.canParticipate : false
    var returnValue = false;
    if(canParticipate == true && registerFromDate <= currentDate && registerToDate >= currentDate ){
      returnValue = true;
    }
    return returnValue;
  }


  /***** CONTEST LEADERS PAGE*****/
  pageHandle(id:any){
    this.router.navigate([`app/contest/show/${id}`]);
  }

}
