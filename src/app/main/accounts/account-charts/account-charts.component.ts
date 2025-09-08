import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Chart from 'chart.js/auto';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account-charts',
  templateUrl: './account-charts.component.html',
  styleUrls: ['./account-charts.component.scss']
})
export class AccountChartsComponent {
  public lotsData: any;
  public profitData: any;

  isLoading: any = false;
  loginSID: any = ""

  // chartData
  lotsDataX: any;
  lotsDataY: any;
  profitDataX: any;
  profitDataY: any;

  // datepiker
  dashboardDateTo: any;
  dashboardDateFrom: any;
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public bsModalService: BsModalService,
    private toastrService: ToastrService,
    private router: Router,
    private titleService: Title
  ) {
    this.loginSID = this.route.snapshot.paramMap.get('id')
  }

  ngOnInit() {
    this.loginSID = this.route.snapshot.paramMap.get('id')
    this.commonService.setCurrentActiveLink('chart');
    this.commonService.pageName = 'Chart';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getAccountChartslots();
    this.getAccountChartsProfit()
  }

  getChartDetails() {
    this.getAccountChartslots();
    this.getAccountChartsProfit()
  }
  maxDate() {
    const maxDate = new Date()
    return maxDate;
  }

  minDate() {
    var minDate: any = ''
    if (this.dashboardDateFrom != '') {
      minDate = this.dashboardDateFrom
    } else {
      minDate = new Date()
    }
    return minDate;
  }


  /***** Lots CHARTS DATA MANAGE   *****/
  lotsCharts() {
    if (this.lotsData) {
      this.lotsData.destroy();
    }
    this.lotsData = new Chart("lotsDataChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.lotsDataX,
        datasets: [
          {
            label: 'Lots',
            data: this.lotsDataY,
            backgroundColor: "orange"
          },

        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.lotsData.update();
  }




  /***** COMMISSIONS CHARTS DATA MANAGE   *****/
  profitCharts() {
    if (this.profitData) {
      this.profitData.destroy();
    }
    this.profitData = new Chart("profitDataChart", {
      type: 'bar', //this denotes tha type of chart


      data: {// values on X-Axis
        labels: this.profitDataX,
        datasets: [
          {
            label: "Profit",
            data: this.profitDataY,
            backgroundColor: '#2196F3'
          },
        ]
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
      }
    });
    this.profitData.update();
  }


  dateRangePiker(val: any, title: any) {
    if (title == 'from') {
      this.dashboardDateFrom = val
    } else if (title == 'to') {
      this.dashboardDateTo = val
    }

  }


  getAccountChartsProfit() {
    const dateformat = new Date()
    const weekDate = new Date(dateformat.getFullYear(), dateformat.getMonth(), 1)
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : weekDate
    const toData = this.dashboardDateTo ? this.dashboardDateTo : dateformat
    const converFrom = moment(fromData).format('YYYY-MM-DD')
    const converTo = moment(toData).format('YYYY-MM-DD')
    const currency = 'USD'
    this.isLoading = true;
    let ApiName = API.ACCOUNTS_CHARTS_PROFIT + `?currency=USD&from=${converFrom}&to=${converTo}&id=${this.loginSID}`
    this.apiService.callApiGetRequest(ApiName, {}).subscribe((res: any) => {
      if (res) {
        this.profitDataX = []
        this.profitDataY = []
        for (let index = 0; index < res.chartData.datasets[0].data.length; index++) {
          const el = res.chartData.datasets[0].data[index];
          this.profitDataX.push(el.x)
          this.profitDataY.push(el.y)
        }
        this.isLoading = false;
        this.profitCharts()
      }
    }, (err: any) => {
      this.isLoading = false;
      this.apiService.callApiPostRequest(API.LOGOUT, {}).subscribe();
      localStorage.clear();
      this.router.navigate([`login`]);
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  getAccountChartslots() {
    const dateformat = new Date()
    const weekDate = new Date(dateformat.getFullYear(), dateformat.getMonth(), 1)
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : weekDate
    const toData = this.dashboardDateTo ? this.dashboardDateTo : dateformat
    const converFrom = moment(fromData).format('YYYY-MM-DD')
    const converTo = moment(toData).format('YYYY-MM-DD')
    this.isLoading = true;
    let ApiName = API.ACCOUNTS_CHARTS_LOTS + `?currency=USD&from=${converFrom}&to=${converTo}&id=${this.loginSID}`
    console.log(ApiName)
    this.apiService.callApiGetRequest(ApiName, {}).subscribe((res: any) => {
      if (res) {
        this.lotsDataX = []
        this.lotsDataY = []
        for (let index = 0; index < res.chartData.datasets[0].data.length; index++) {
          const el = res.chartData.datasets[0].data[index];
          this.lotsDataX.push(el.x)
          this.lotsDataY.push(el.y)
        }
         this.lotsCharts()

        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');

    })
  }
}
