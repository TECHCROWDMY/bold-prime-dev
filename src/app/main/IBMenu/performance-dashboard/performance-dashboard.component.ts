import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { TransferFundsComponent } from 'src/app/shared/modals/transfer-funds/transfer-funds.component';
import { IbDashboardShowComponent } from '../ib-dashboard/ib-dashboard-show/ib-dashboard-show.component';
import { format } from 'highcharts';
import { filter } from 'rxjs';

export interface Pair {
  stringVal: string;
  value: number;
}

@Component({
  selector: 'app-performance-dashboard',
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.scss'],
})
export class PerformanceDashboardComponent {
  isLoading: any = false;
  dashboardDateTo: any;
  dashboardDateFrom: any;
  userDetail: any;
  modalRef: any;
  showIBS: boolean = false;

  dashboardList: Set<any> = new Set();

  plushBtn = true;
  minusBtn = false;
  searchInput: any;
  limit: number = 0;
  ibTotal: any;
  balanceAmount: any = '';
  loginSid: any = '';
  isChecked = false;
  typingTimer: any;
  directReferrals: any;
  totalRecords: any;
  ftd: any;
  ftdPercentage: any;
  activeSearch = false;
  public TotalCommissionSlot: number = 0;
  public TotalCommissionUsd: number = 0;
  public TotalRegistrations: number = 0;

  isExpanded: boolean = false;

  // Shorting
  shortingField: any = ''; // shorting Field
  shortingDir: any = ''; // shorting Dir - ASC & DESC
  dashboardListRows = [
    { name: '' },
    { name: 'Balance, USD', key: 'balance' },
    { name: 'Equity, USD', key: 'equity' },
    { name: 'Deposits, USD', key: 'deposits' },
    { name: 'Withdrawals, USD', key: 'withdrawals' },
    { name: 'Lots', key: 'lots' },
    { name: 'Commission, USD', key: 'commission' },
    { name: 'Country', key: 'country' },
    { name: '' },
  ];
  showSuccessAlert: boolean = false;
  loginID: any = '';

  @ViewChild('headerContainer', { static: true }) headerContainer!: ElementRef;
  @ViewChild('bodyContainer', { static: true }) bodyContainer!: ElementRef;

  constructor(
    public commonService: CommonService,
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private titleService: Title,
    public bsModalService: BsModalService
  ) {}

  ngOnInit() {
    this.commonService.setCurrentActiveLink('performance-dashboard');
    this.commonService.pageName = 'Performance Dashboard';
    this.userDetail = JSON.parse(localStorage.getItem('boldUserDetail') || '');
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);

    const date = new Date();
    const weekDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.dashboardDateFrom = moment(date).format('YYYY-MM-DD');
    this.dashboardDateTo = moment(date).format('YYYY-MM-DD');

    this.getDashboardList();
    this.getChartData();
    // this.getAccountDetails('ib_wallet');

    if (this.router.url.split('?')[1]) {
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.router.navigate(['app/ib-dashboard']);
        this.showSuccessAlert = false;
      }, 3000);
    }
  }

  ngAfterViewInit() {
    this.syncScroll(
      this.headerContainer.nativeElement,
      this.bodyContainer.nativeElement
    );
    this.syncScroll(
      this.bodyContainer.nativeElement,
      this.headerContainer.nativeElement
    );
  }

  syncScroll(source: HTMLElement, target: HTMLElement) {
    source.addEventListener('scroll', () => {
      target.scrollLeft = source.scrollLeft;
    });
  }

  minDate() {
    var minDate: any = '';
    if (this.dashboardDateFrom != '') {
      minDate = this.dashboardDateFrom;
    } else {
      minDate = new Date();
    }
    return minDate;
  }

  maxDate() {
    const maxDate = new Date();
    return maxDate;
  }
  /***** REGISTRATION CHARTS DATA MANAGE   *****/

  dateRangePiker(val: any, title: any) {
    if (title == 'from') {
      this.dashboardDateFrom = val;
    } else if (title == 'to') {
      this.dashboardDateTo = val;
    }
  }

  /***** GET CHART DATA   *****/
  getChartData() {
    const dateformat = new Date();
    const weekDate = new Date().setDate(new Date().getDate() - 30);
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : weekDate;
    const toData = this.dashboardDateTo ? this.dashboardDateTo : dateformat;
    const converFrom = moment(fromData).format('YYYY-MM-DD');
    const converTo = moment(toData).format('YYYY-MM-DD');

    this.dashboardDateFrom = converFrom;
    this.dashboardDateTo = converTo;

    const currency = 'USD';

    const APIName =
      API.PERFORMANCE_DASHBOARD +
      `?version=1.0.0&from=${converFrom}&to=${converTo}&currency=${currency}`;
    this.isLoading = true;
    this.apiService.callApiGetRequest(APIName, {}).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
          for (let index = 0; index < res.totals.length; index++) {
            const labelData = res.totals[index];
            for (let index = 0; index < labelData.data.length; index++) {
              if (labelData.label === 'Total Volume') {
                this.TotalCommissionSlot = labelData.data;
              }
              if (labelData.label === 'Commissions') {
                this.TotalCommissionUsd = labelData.data;
              }
              if (labelData.label === 'Registrations') {
                this.TotalRegistrations = labelData.data;
              }
            }
          }
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

  // mv-1
  getDashboardList() {
    this.dashboardList = new Set();

    this.isLoading = true;
    this.minusBtn = false;
    this.plushBtn = true;
    const dateformat = new Date();
    var date = dateformat ? dateformat : '';
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
    const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
    const body = {
      from: fromData != undefined ? fromData : date,
      to: toData != undefined ? toData : date,
      search: this.searchInput,
      currency: 'USD',
      onlyIsIb: this.showIBS,
      segment: {
        limit: 20 + this.limit,
        offset: 0,
      },
      sorting: {
        field: this.shortingField,
        direction: this.shortingDir,
      },
      withTotals: true,
    };

    body.from = moment(body.from).format('YYYY-MM-DD');
    body.to = moment(body.to).format('YYYY-MM-DD');
    console.log(this.searchInput, 'apaan ini');
    // console.log(this.searchInput);
    console.log(body.from);
    console.log(body.to);
    const PROC_API =
      this.searchInput == undefined
        ? API.DASHBOARD_LIST
        : `${API.DASHBOARD_LIST}?version=1.0.0&ibId=${this.searchInput}`;

    this.apiService.callApiPostRequest(PROC_API, body).subscribe(
      (res: any) => {
        if (res) {
          console.log(res, 77771);
          this.directReferrals = res.totals.directCount.toString();
          this.totalRecords = res.totals.totalCount;
          this.ftd = res.headers.ftdCount;

          this.ftdPercentage = (res.headers.ftdCount / res.headers.total) * 100;
          this.ftdPercentage = parseInt(this.ftdPercentage);
          console.log(res, 'myman');
          this.isLoading = false;

          if (res.referrals && res.referrals?.length > 0) {
            res.referrals = this.uniqueArray(res.referrals);
            if (this.activeSearch) {
              this.dashboardList = new Set();
              this.activeSearch = false;
            }
            res.referrals.forEach((referral: any) =>
              this.dashboardList.add(referral)
            );

            this.ibTotal = res.totals;
            this.handleParseFloatDashboardList(this.dashboardList);
          } else {
            this.dashboardList = new Set();
          }

          // this.searchdashboardList = res

          if (this.isExpanded === true) {
            this.isExpandAllBtn();
            console.log('jalan kok');
          } else {
            this.isCollapseBtn();
          }
        }
        console.log('jalan bro', res);
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  handleParseFloatDashboardList(data: any) {
    console.log(data, 555);

    if (!(data instanceof Set)) {
      console.error('Input data is not a Set');
      return;
    }

    const dataArray = Array.from(data);

    const manipulatedData = dataArray.map((item) => {
      const keys = [
        'balance',
        'equity',
        'deposits',
        'withdrawals',
        'lots',
        'commission',
      ];
      keys.forEach((key) => {
        if (typeof item.values[key] === 'number') {
          item.values[key] = +item.values[key].toFixed(2);
          item.values._total_[key] = +Number(item.values._total_[key]).toFixed(
            2
          );
        }
      });
      return item;
    });

    this.dashboardList = new Set(manipulatedData);
  }

  submitFunction() {
    this.activeSearch = true;
    this.limit = 0;
    this.getDashboardList();
    this.getChartData();
  }

  pageHandle(val: any) {
    if (val == 'withdraw') {
      this.router.navigate([`app/withdraw`]);
    } else if (val == 'transferToTrading') {
      this.modalRef = this.bsModalService.show(TransferFundsComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: {
          balanceAmount: this.balanceAmount,
          loginSid: this.loginSid,
        },
      });
    } else if (val == 'tableView') {
      const url = `app/dashboard-referrals`;
      window.open(url);
      // this.router.navigate([`app/ib-dashboard/show/${userAccID}`]);
    }
  }

  groupReferralsStats(event: any) {
    this.isChecked = event.target.checked;
  }

  getAccountList(ele: any) {
    const userAccID = ele.referralId;
    const userName = ele.fullName;

    if (userAccID) {
      const modalInitialState = {
        userAccID: userAccID,
        userName: userName,
      } as Partial<IbDashboardShowComponent>;
      this.modalRef = this.bsModalService.show(IbDashboardShowComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: modalInitialState,
      });
    }
  }

  getIbData() {
    const dateformat = new Date();
    this.isLoading = true;
    var date = dateformat ? dateformat : '';
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
    const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
    const body = {
      from: fromData != undefined ? fromData : date,
      to: toData != undefined ? toData : date,
      search: this.searchInput,
      currency: 'USD',
      onlyIsIb: true,
      segment: {
        limit: 20 + this.limit,
        offset: 0,
      },
      withTotals: true,
    };

    body.from = moment(body.from).format('YYYY-MM-DD');
    body.to = moment(body.to).format('YYYY-MM-DD');

    this.apiService.callApiPostRequest(API.DASHBOARD_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = false;
          console.log(res, 'apaan ini');
          if (res.referrals && res.referrals?.length > 0) {
            this.dashboardList = new Set();
            if (this.activeSearch) {
              this.activeSearch = false;
            }
            res.referrals.forEach((referral: any) =>
              this.dashboardList.add(referral)
            );

            this.ibTotal = res.totals;
            this.handleParseFloatDashboardList(this.dashboardList);

            this.totalRecords = res.totals.totalCount;
            this.directReferrals = res.totals.directCount;
          } else {
            this.dashboardList = new Set();
          }

          console.log(this.dashboardList, 'test');

          if (this.isExpanded === true) {
            this.isExpandAllBtn();
            console.log('jalan kok');
          } else {
            this.isCollapseBtn();
          }
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

  filterManage(event: any) {
    this.isLoading = true;
    console.log(this.showIBS, 555, 'apakah');
    if (this.minusBtn) {
      this.minusBtn = false;
      this.plushBtn = true;
    }
    this.showIBS = event.target.checked;
    this.dashboardList = new Set();
    this.limit = 0;
    console.log(this.showIBS, 'apaan ini');
    if (this.showIBS) {
      this.getIbData();
    } else {
      this.getDashboardList();
    }
  }

  isCollapseBtn() {
    this.isExpanded = false;

    // Convert Set to Array for iteration and filtering
    const dashboardListArray = Array.from(this.dashboardList);

    let needsFiltering = false;

    // Iterate and mark items, and set the flag if filtering is needed
    for (const item of dashboardListArray) {
      if (item.directCount > 0 && item.childrenAvailable === true) {
        item['isPlus'] = false;
        needsFiltering = true;
      }
    }

    if (needsFiltering) {
      // Perform filtering outside the loop
      const filteredList = dashboardListArray.filter((item: any) => {
        return item.parentIndex !== item.ibId;
      });

      // Convert filtered array back to Set
      this.dashboardList = new Set(filteredList);
      console.log(filteredList, 'pow', this.dashboardList);
    }
  }

  searchHandle(event: any) {
    this.searchInput = event.target.value;
    this.activeSearch = true;
    this.limit = 0;
    if (this.searchInput.length > 2) {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.getDashboardList();
      }, 500);

      this.minusBtn = false;
      this.plushBtn = true;
    }
    if (this.searchInput.length == 0) {
      this.dashboardList = new Set();
      this.isExpandAllBtnCalled = false;
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.getDashboardList();
      }, 500);

      this.minusBtn = false;
      this.plushBtn = true;
    }
  }

  uniqueArray = (arr: any) => {
    const seen = new Set();
    return arr.filter((item: any) => {
      const itemString = JSON.stringify(item);
      return seen.has(itemString) ? false : seen.add(itemString);
    });
  };

  getAllSubList(ibId: any, index: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const dateformat = new Date();
      this.isLoading = true;
      const date = dateformat ? dateformat : '';
      const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
      const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
      const body = {
        from: fromData != undefined ? fromData : date,
        to: toData != undefined ? toData : date,
        search: this.searchInput,
        currency: 'USD',
        ibId: ibId,
        withTotals: true,
        onlyIsIb: this.showIBS,
      };
      this.apiService.callApiPostRequest(API.DASHBOARD_LIST, body).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res && res.referrals && res.referrals.length > 0) {
            let mapperSorting =
              this.shortingColumn == 1
                ? 'balance'
                : this.shortingColumn == 2
                ? 'equity'
                : this.shortingColumn == 3
                ? 'deposits'
                : this.shortingColumn == 4
                ? 'withdrawals'
                : this.shortingColumn == 5
                ? 'lots'
                : this.shortingColumn == 6
                ? 'commission'
                : this.shortingColumn == 7
                ? 'country'
                : 'others';

            res.referrals.sort((a: any, b: any) => {
              if (this.shortingDir == 'ASC') {
                return b.values[mapperSorting] - a.values[mapperSorting];
              } else if (this.shortingDir == 'DESC') {
                return a.values[mapperSorting] - b.values[mapperSorting];
              }
              return 0;
            });

            res.referrals = this.uniqueArray(res.referrals);
            resolve({ ibId: ibId, referrals: res.referrals });
          } else {
            this.dashboardList = new Set();
            resolve([]); // Resolve with an empty array if there are no referrals
          }
        },
        (err: any) => {
          this.isLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
          reject(err); // Reject the promise if there's an error
        }
      );
    });
  }

  private isExpandAllBtnCalled = false;

  isSubExpandBtn(ibId: any, index: any, isPlus: any) {
    const dashboardListArray = Array.from(this.dashboardList);
    if (!isPlus) {
      console.log('myman');
      if (this.searchInput === undefined) {
        console.log('jalan bro');
        this.getSubList(ibId, index);
      } else if (this.searchInput !== '' || this.searchInput !== undefined) {
        dashboardListArray[index]['isPlus'] = true;
        console.log(dashboardListArray, 777);

        dashboardListArray[index].children.forEach((item: any, index2: any) => {
          dashboardListArray.splice(index + 1, 0, item);
          item['parentIndex'] = ibId;
        });

        this.dashboardList = new Set(dashboardListArray);
        console.log(dashboardListArray, 777);

        return;
      }
    } else {
      dashboardListArray[index]['isPlus'] = false;
      const filteredList = dashboardListArray.filter((item: any) => {
        return item.parentIndex !== ibId;
      });
      console.log(filteredList, 777);

      this.dashboardList = new Set(filteredList);
    }
  }

  getSubList(ibId: any, index: any) {
    const dateformat = new Date();
    this.isLoading = true;
    const date = dateformat ? dateformat : '';
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
    const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
    const body = {
      from: fromData != undefined ? fromData : date,
      to: toData != undefined ? toData : date,
      search: this.searchInput,
      currency: 'USD',
      ibId: ibId,
      withTotals: true,
      onlyIsIb: this.showIBS,
    };
    this.apiService.callApiPostRequest(API.DASHBOARD_LIST, body).subscribe(
      (res: any) => {
        console.log(res, 77712);
        if (+res.referrals?.length > 0 || res.showAccountsButton === true) {
          this.isLoading = false;
          let mapperSorting =
            this.shortingColumn == 1
              ? 'balance'
              : this.shortingColumn == 2
              ? 'equity'
              : this.shortingColumn == 3
              ? 'deposits'
              : this.shortingColumn == 4
              ? 'withdrawals'
              : this.shortingColumn == 5
              ? 'lots'
              : this.shortingColumn == 6
              ? 'commission'
              : this.shortingColumn == 7
              ? 'country'
              : 'others';

          res.referrals.sort((a: any, b: any) => {
            console.log(a.values[mapperSorting], b.values[mapperSorting], 789);
            if (this.shortingDir == 'ASC') {
              return b.values[mapperSorting] - a.values[mapperSorting];
            } else if (this.shortingDir == 'DESC') {
              return a.values[mapperSorting] - b.values[mapperSorting];
            }
            return 0;
          });

          const dashboardListArray = Array.from(this.dashboardList);

          for (let i = res.referrals.length - 1; i >= 0; i--) {
            const item = res.referrals[i];
            if (item.levelName >= 0) {
              item.levelName = item.levelName;
            }
            item['parentIndex'] = ibId;

            let findIndex = dashboardListArray.findIndex(
              (referral: any) => referral.referralId == item.ibId
            );
            console.log(dashboardListArray, findIndex, item, 'yow');

            if (findIndex !== -1) {
              dashboardListArray[findIndex]['isPlus'] = true;
            }

            dashboardListArray.splice(findIndex + 1, 0, item);
            this.tempArray += 1;
          }

          this.dashboardList = new Set(this.uniqueArray(dashboardListArray));
          if (this.searchInput !== '' || this.searchInput !== null) {
            this.dashboardList = new Set(
              [...this.dashboardList].filter(
                (item: any) =>
                  item.childrenAvailable === true ||
                  item.fullName
                    ?.toLowerCase()
                    .includes(this.searchInput.toLowerCase())
              )
            );

            // const dashboardListArray = Array.from(this.dashboardList);
            // const filteredArray = [];
            // for (let i = 0; i < dashboardListArray.length; i++) {
            //   const item = dashboardListArray[i];
            //   if (item.levelName === 'direct') {
            //     filteredArray.push(item);
            //   }
            //   if (
            //     item.fullName
            //       ?.toLowerCase()
            //       .includes(this.searchInput.toLowerCase())
            //   ) {
            //     filteredArray.push(dashboardListArray[i - 1]);
            //     filteredArray.push(item);
            //   }
            // }

            // this.dashboardList = new Set(filteredArray);
          }
          this.isLoading = false;
        } else {
          console.log('myman2');
          this.dashboardList = new Set();
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

  async isExpandAllBtn(): Promise<any> {
    // this.isCollapseBtn();
    let allArr: any = [];
    let index = 0;

    let finalIndex = 0;
    this.isExpanded = true;
    if (this.searchInput === undefined || this.searchInput === '') {
      for (const item of this.dashboardList) {
        console.log(item.fullName, 111, 'index: ', index);
        if (item.childrenAvailable === true) {
          const result = await this.getAllSubList(item.referralId, index);
          allArr.push(result);
        }
        index++;
      }
      return new Promise<void>((resolve, reject) => {
        let dashboardListArray = Array.from(this.dashboardList);

        console.log('masuk pak eko', allArr);
        for (let i = allArr.length - 1; i >= 0; i--) {
          const data = allArr[i];
          console.log(666, data);
          let index = dashboardListArray.findIndex(
            (referral: any) => referral.referralId == data.ibId
          );

          if (index !== -1) {
            dashboardListArray[index]['isPlus'] = true;
            for (let j = data.referrals.length - 1; j >= 0; j--) {
              const item = data.referrals[j];
              item['parentIndex'] = item.ibId;
              dashboardListArray.splice(index + 1, 0, item);
              this.dashboardList = new Set(dashboardListArray);
              dashboardListArray = Array.from(this.dashboardList);

              if (item?.directCount > 0 || item.childrenAvailable == true) {
                let index1 = dashboardListArray.findIndex(
                  (referral: any) => referral.referralId == item.referralId
                );

                this.isSubExpandBtn(item?.referralId, index1, item?.isPlus);
              }
            }
          }
        }

        resolve();
      });
    } else {
      let dashboardListArray = Array.from(this.dashboardList);
      console.log(dashboardListArray, 'debug1');

      function insertChildren(array: any[], index: number) {
        const children = array[index].children;
        if (children && children.length > 0) {
          console.log(children, 'debug123'); // Debug log to show children being processed
          array[index]['isPlus'] = true;
          children.forEach((child: any) => {
            child['parentIndex'] = child.ibId;
          });

          // Insert children into the array
          array.splice(index + 1, 0, ...children);
          console.log(array, `Array after splice at index ${index}`); // Debug log to show the array after splice

          // Adjust the index for the newly inserted elements and recursively insert nested children
          for (let i = 0; i < children.length; i++) {
            insertChildren(array, index + 1 + i);
          }
        }
      }

      let index = 0;
      while (index < dashboardListArray.length) {
        console.log(dashboardListArray[index], 'debug123456'); // Debug log to show each element
        insertChildren(dashboardListArray, index);
        index++;
      }

      console.log(dashboardListArray, 'Final dashboardListArray'); // Debug log to show the final array
      this.dashboardList = new Set(dashboardListArray);
    }
  }

  tempArray: number = 0;

  loadmore() {
    this.limit = this.limit + 20;

    // if (this.tempArray > 0) {
    //   // this.dashboardList = new Set();
    //   this.dashboardList.splice(
    //     this.dashboardList.length - this.tempArray,
    //     this.tempArray
    //   );

    //   this.tempArray = 0;
    // }
    this.getDashboardList();
  }

  getAccountDetails(type: any) {
    let body = {
      category: type,
    };
    this.apiService.callApiPostRequest(API.ACCOUNTS, body).subscribe(
      (res: any) => {
        if (res) {
          const Amounts = res[0]?.balance;
          this.balanceAmount = Amounts ? Amounts.toFixed(2) : '0.00';
          this.loginID = res[0]?.login;
          this.loginSid = res[0]?.loginSid;
        }
      },
      (err: any) => {
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  shortingColumn: any;
  /***** SHORTING   *****/
  shortingHandle(item: any, type: any, index: any) {
    this.isLoading = true;
    this.shortingColumn = null;
    if (this.shortingField == item.key && this.shortingDir !== '') {
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : '';
    } else {
      console.log(this.shortingDir, 7777);
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : 'DESC';
    }
    this.shortingField = item.key;
    this.shortingColumn = index;
    console.log(this.shortingColumn, 'aaa');

    this.dashboardList = new Set();
    this.limit = 0;

    this.getDashboardList();
  }

  protected readonly parseFloat = parseFloat;
}
