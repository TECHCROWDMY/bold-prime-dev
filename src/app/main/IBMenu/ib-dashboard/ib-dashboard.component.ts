import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TransferFundsComponent } from 'src/app/shared/modals/transfer-funds/transfer-funds.component';
import { IbDashboardShowComponent } from './ib-dashboard-show/ib-dashboard-show.component';
import { Title } from '@angular/platform-browser';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import UserService from 'src/app/shared/helpers/UserService';

defineLocale('en-gb', enGbLocale);
export interface Pair {
  stringVal: string;
  value: number;
}
@Component({
  selector: 'app-ib-dashboard',
  templateUrl: './ib-dashboard.component.html',
  styleUrls: ['./ib-dashboard.component.scss'],
})
export class IbDashboardComponent {
  // bsValue: any = new Date();
  // bsRangeValue: any;
  // maxDate: any = new Date();
  filterMenu: any = [];
  modalRef: any;
  showIBS: any = false;
  isLoading: any = false;
  isLoadingBox: boolean = false;
  searchdashboardList: any = [];
  dashboardDateTo: any;
  dashboardDateFrom: any;
  dateRangeFrom: any;
  dateRangeTo: any;
  dateFormat: any;
  isLoadingData: any = false;

  BalanceUSDAmount: any = 0;
  equityUSDAmount: any = 0;
  depositsUSDAmount: any = 0;
  withdrawalsUSDAmount: any = 0;
  lotsUSDAmount: any = 0;
  commissionUSDAmount: any = 0;
  balanceAmount: any = '';
  loginID: any = '';
  shortingField: any = '';
  shortingDir: any = '';
  onlyIsIb = false;
  showSuccessAlert: boolean = false;
  expand: any;

  //
  plushBtn = true;
  minusBtn = false;
  searchInput: any;
  limit: number = 0;
  dashboardList: any = [];
  ibTotal: any;
  loginSid: any = '';
  canWithdraw: any;

  public CommissionsChart: any;
  public volumeData: any;
  public registrationsData: any;
  public referralInfo: any;
  public topTradingInstruments: any;
  // userDetail: any;
  userChartData: any;
  userDetail: [] = [];
  CommissionsDataX: any;
  CommissionsDataY: any;
  volumeDataX: any;
  volumeDataY: any;
  registrationsDataX: any;
  registrationsDataY: any;
  totalReg: any;
  totalClick: any;
  otherPercentage: any;
  totalPercentages: any;
  linksList: any;
  activeLink: any;
  inactiveLink: any;
  isChecked = false;
  typingTimer: any;
  directReferrals: any;
  totalRecords: any;
  totalDeposits: any;
  totalWithdraws: any;
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
  public TotalCommissionSlot: number = 0;
  public TotalCommissionUsd: string = '$0';
  public TotalRegistrations: number = 0;
  public percentageDifference: number = 0;
  public percentageDifferenceDeposit: number = 0;
  public percentageDifferenceLot: number = 0;
  public percentageDifferenceCommission: number = 0;
  public percentageDifferenceAct: number = 0;

  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    public bsModalService: BsModalService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private titleService: Title,
    private localeService: BsLocaleService,
    private userService: UserService
  ) {
    this.localeService.use('en-gb');
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('ib-dashboard');
    this.commonService.pageName = 'Dashboard';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.getAccountDetails('ib_wallet');
    this.checkPermissions();

    this.getChartData();

    // this.getDashboardList()
    // this.getSumTotalWithdraw();
    // this.getSumTotalDeposit();

    this.userService
      .getUserPermission()
      .then(() => {
        this.checkWithdraw();
        this.checkTransfer();
      })
      .catch((error) => {
        console.error('Error getting user permission', error);
      });
  }

  checkPermissions() {
    let requestBody = {
      sections: [
        {
          key: 'applications.questionnaire.step1',
          fields: [
            {
              key: 'Select IB Account currency',
              value: 'USD',
            },
          ],
        },
      ],
      configId: 15, // Check this value
      loginSid: '',
    };
    this.apiService.callApiPostRequest(API.REQUEST_IB, requestBody).subscribe(
      (res: any) => {
        if (res) {
          const storedUserDetailsString =
            localStorage.getItem('boldUserDetail') || '{}';
          const storedUserDetails = JSON.parse(storedUserDetailsString);
          storedUserDetails.isIb = true;
          localStorage.setItem(
            'boldUserDetail',
            JSON.stringify(storedUserDetails)
          );
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.errors.children.loginSid.errors
            ? err.error.errors.children.loginSid.errors[0]
            : 'something went wrong'
        );
      }
    );
  }

  dateRangePiker(val: any, title: any) {
    if (title == 'from') {
      this.dashboardDateFrom = val;
    } else if (title == 'to') {
      this.dashboardDateTo = val;
    }
  }

  maxDate() {
    const maxDate: any = new Date();
    return maxDate;
  }

  minDate() {
    var minDate: any = '';
    if (this.dashboardDateFrom != '') {
      minDate = this.dashboardDateFrom;
    } else {
      const currentDate = new Date();
      const previousMonthDate = new Date().setDate(new Date().getDate() - 30);
      minDate = previousMonthDate;
    }
    return minDate;
  }

  getApiDashboardlist(from: any, to: any, currency: any) {
    this.isLoading = true;
    this.minusBtn = false;
    this.plushBtn = true;
    const dateformat = new Date();
    var date = dateformat ? dateformat : '';

    const body = {
      from: from != undefined ? from : date,
      to: to != undefined ? to : date,
      search: this.searchInput,
      currency: 'USD',
      onlyIsIb: this.showIBS,
      segment: {
        limit: 20,
        offset: this.limit,
      },
      sorting: {
        field: this.shortingField,
        direction: this.shortingDir,
      },
      withTotals: true,
    };

    body.from = moment(body.from).format('YYYY-MM-DD');
    body.to = moment(body.to).format('YYYY-MM-DD');

    const PROC_API =
      this.searchInput == undefined
        ? API.DASHBOARD_LIST
        : `${API.DASHBOARD_LIST}?version=1.0.0&ibId=${this.searchInput}`;

    this.apiService.callApiPostRequest(PROC_API, body).subscribe(
      (res: any) => {
        // console.log('cek ini dulu', res);
        if (res) {
          this.directReferrals = res.headers.directCount;
          this.totalRecords = res.headers.total;

          if (res.referrals && res.referrals?.length > 0) {
            this.dashboardList = this.dashboardList.concat(res.referrals);
            this.totalDeposits = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(res.totals.deposits);
            this.totalWithdraws = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(res.totals.withdrawals);
            // this.totalDeposits = res.totals.deposits;
            // this.totalWithdraws = res.totals.withdrawals;
          } else {
            this.dashboardList = [];
          }

          // this.searchdashboardList = res
        }
        this.isLoading = false;
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  // Config Api
  configApi() {
    const dateformat = new Date();

    // Get latest 30 days
    const dateBefore1Month = new Date().setDate(new Date().getDate() - 30);
    const fromData = this.dashboardDateFrom
      ? this.dashboardDateFrom
      : dateBefore1Month;
    const toData = this.dashboardDateTo ? this.dashboardDateTo : dateformat;

    // For displaying in filter date range
    const dateFrom = moment(fromData).format('DD-MM-YYYY');
    const dateTo = moment(toData).format('DD-MM-YYYY');
    this.dateRangeFrom = dateFrom;
    this.dateRangeTo = dateTo;

    // For filtering and send to api
    const converFrom = moment(fromData).format('YYYY-MM-DD');
    const converTo = moment(toData).format('YYYY-MM-DD');
    this.dashboardDateFrom = converFrom;
    this.dashboardDateTo = converTo;

    const currency = 'USD';

    this.getApiPerformanceDashboard(
      this.dashboardDateFrom,
      this.dashboardDateTo,
      currency
    );
    // this.getApiLinks(this.dashboardDateFrom,this.dashboardDateTo, currency);
    this.getApiCommissonList(
      this.dashboardDateFrom,
      this.dashboardDateTo,
      currency
    );

    // this.getApiCommissonList(
    //   this.dashboardDateFrom,
    //   this.dashboardDateTo,
    //   currency
    // );

    this.getApiDashboardlist(
      this.dashboardDateFrom,
      this.dashboardDateTo,
      currency
    );
  }

  // Call ApiService API Performance Dashboard
  getApiPerformanceDashboard(from: any, to: any, currency: any) {
    const APIName =
      API.PERFORMANCE_DASHBOARD +
      `?version=1.0.0&from=${from}&to=${to}&currency=${currency}`;
    this.isLoading = true;
    this.apiService.callApiGetRequest(APIName, {}).subscribe(
      (res: any) => {
        if (res) {
          this.userChartData = res.charts;

          for (let index = 0; index < res.charts.length; index++) {
            const multiChartData = res.charts[index];
            for (let index = 0; index < multiChartData.data.length; index++) {
              this.chartDataHandle(multiChartData.data, multiChartData.label);
              break;
            }
          }

          this.userDetail = res.totals;
          for (let index = 0; index < res.totals.length; index++) {
            const labelData = res.totals[index];
            for (let index = 0; index < labelData.data.length; index++) {
              if (labelData.label === 'Total Volume') {
                this.TotalCommissionSlot = labelData.data;
              }
              if (labelData.label === 'Commissions') {
                const splitterData = labelData.data.split(' ');
                const numericString = splitterData[0].replace(/,/g, '');
                const value = parseFloat(numericString);
                if (!isNaN(value)) {
                  this.TotalCommissionUsd = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value);
                } else {
                  this.TotalCommissionUsd = '0.00';
                }
              }
              if (labelData.label === 'Registrations') {
                this.TotalRegistrations = labelData.data;
                this.referralInfoHandle(this.TotalRegistrations);
              }
              this.isLoading = false;
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

  // Call ApiService API Links
  getApiLinks(from: any, to: any, currency: any) {
    this.isLoading = true;
    const APINameReferralInfo = API.LINKS;
    this.apiService.callApiGetRequest(APINameReferralInfo, {}).subscribe(
      (res: any) => {
        if (res) {
          this.linksList = res;
          var activeLinkCount = res.filter(
            (item: any) => item.isActive == true
          );
          var inactiveLinkCount = res.filter(
            (item: any) => item.isActive == false
          );
          this.activeLink = activeLinkCount.length;
          this.inactiveLink = inactiveLinkCount.length;
          this.referralInfoHandle(this.linksList);
        }
        this.isLoading = false;
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  // Call ApiService API Commisson List
  getApiCommissonList(from: any, to: any, currency: any) {
    const APINameTopTradingInstruments =
      API.COMMISSION_LIST +
      `?version=1.0.0&from=${from}&to=${to}&currency=${currency}`;
    this.apiService
      .callApiPostRequest(APINameTopTradingInstruments, {})
      .subscribe(
        (res: any) => {
          if (res) {
            this.tradingInstrumentsHandle(res);
            console.log('show chart');
          }
          this.isLoading = false;
        },
        (err: any) => {
          this.isLoading = false;
          this.tradingInstrumentsHandle('error');
          // this.toastrService.error(
          //   err.error.message ? err.error.message : 'something went wrong'
          // );
        }
      );
  }

  extractNumberFromString(inputString: string): number {
    // Remove non-numeric characters (commas, spaces, "lots")
    const cleanedString = inputString.replace(/[^0-9.]/g, '');

    // Convert to a number
    const numberValue = parseFloat(cleanedString);

    // Handle potential parsing errors
    if (isNaN(numberValue)) {
        throw new Error('Invalid number format');
    }

    return numberValue;
}


  /**** GET SUM TOTAL Deposit Data ****/

  /*** GET TOtal percentage difference between start and end date ***/
  calculatePercentageDifference(oldValue: number = 0, newValue: number = 0): number {
    if (isNaN(oldValue) || oldValue === 0) {
      return 0; // Avoid division by zero and handle NaN values
    }
    // old start B
    // new end A
    const difference = newValue - oldValue;
    // console.log(difference)
    // const percentageDifference = (difference / oldValue) * 100;
    const percentageDifference = (difference / newValue) * 100;
    // console.log(percentageDifference)
    return isNaN(percentageDifference) || !isFinite(percentageDifference)
      ? 0
      : percentageDifference; // Replace NaN and Infinity with 0
  }

  // commission lot active client
  getLCA() {
    const dateformat = new Date();
    const weekDate = new Date().setDate(new Date().getDate() - 30);
    const startDate = this.dashboardDateFrom
      ? this.dashboardDateFrom
      : weekDate;
    // Assuming dashboardDateFrom is a date string or other input from a date picker
    const dashboardDateFrom = new Date(this.dashboardDateFrom);
    const lastYearSameDate = new Date(
      dashboardDateFrom.getFullYear() - 1,
      dashboardDateFrom.getMonth(),
      dashboardDateFrom.getDate()
    );

     const converFrom = moment(lastYearSameDate).format('YYYY-MM-DD');
    // const converTo = moment(toData).format('YYYY-MM-DD');

    const endDate = this.dashboardDateTo ? this.dashboardDateTo : dateformat;


    const currency = 'USD';

    const getLot = (dateFrom: string, dateTo: Date) => {
      const APIName =
            API.PERFORMANCE_DASHBOARD +
            `?version=1.0.0&from=${dateFrom}&to=${dateTo}&currency=${currency}`;
      return this.apiService.callApiGetRequest(APIName, {});

    }

     getLot(converFrom, startDate).subscribe(
      (startRes: any) => {
        console.log(startRes);
        this.isLoading = true;

        let startResLot: any;
        let startResComm: any;
        let startResActive : any;

        if (startRes) {
          for (let index = 0; index < startRes.totals.length; index++) {
            const labelData = startRes.totals[index];
            for (let index = 0; index < labelData.data.length; index++) {
              if (labelData.label === 'Total Volume') {
                // console.log(labelData);
                startResLot = this.extractNumberFromString(labelData.data);
              }
              if (labelData.label === 'Commissions') {
                const splitterData = labelData.data.split(' ');
                const numericString = splitterData[0].replace(/,/g, '');
                const value = parseFloat(numericString);
                if (!isNaN(value)) {
                  startResComm = value;
                } else {
                  startResComm = 0;
                }
              }
              if (labelData.label === 'Registrations') {
                startResActive = labelData.data;
              }
            }
          }

          getLot(converFrom, endDate).subscribe(
      (endRes: any) => {
               let endResLot, endResComm, endResActive = 0;
                 if (endRes) {
                   for (let index = 0; index < endRes.totals.length; index++) {
                     const labelData = endRes.totals[index];
                     for (let index = 0; index < labelData.data.length; index++) {
                       if (labelData.label === 'Total Volume') {
                         endResLot = this.extractNumberFromString(labelData.data);
                       }
                       if (labelData.label === 'Commissions') {
                         const splitterData = labelData.data.split(' ');
                         const numericString = splitterData[0].replace(/,/g, '');
                         const value = parseFloat(numericString);
                         if (!isNaN(value)) {
                           endResComm = value;
                         } else {
                           endResComm = 0;
                         }
                       }
                       if (labelData.label === 'Registrations') {
                         endResActive = labelData.data;
                       }
                     }
                   }
                 }
                // console.log('start res lot', startResLot);
              // console.log('end res lot', endResLot);

          this.percentageDifferenceLot =
            this.calculatePercentageDifference(
             startResLot, endResLot
            );

          // console.log('diff res lot', this.percentageDifferenceLot);
          this.percentageDifferenceCommission =
            this.calculatePercentageDifference(
              startResComm,
              endResComm
            );

          this.percentageDifferenceAct =
            this.calculatePercentageDifference(
              startResActive,
              endResActive
            );
          })
          this.isLoading = false;
        }
      })

  }
  getSumTotalDeposit() {
    // this.isLoading = true;

    // const APINameTransaction = API.CLIENT_TRANSACTIONS_LIST + `?version=1.0.0`;
    const dateformat = new Date();
    const weekDate = new Date().setDate(new Date().getDate() - 30);
    const startDate = this.dashboardDateFrom
      ? this.dashboardDateFrom
      : weekDate;
    // Assuming dashboardDateFrom is a date string or other input from a date picker
    const dashboardDateFrom = new Date(this.dashboardDateFrom);
    const lastYearSameDate = new Date(
      dashboardDateFrom.getFullYear() - 1,
      dashboardDateFrom.getMonth(),
      dashboardDateFrom.getDate()
    );

    const endDate = this.dashboardDateTo ? this.dashboardDateTo : dateformat;
    const APINameTransaction =
      this.searchInput == undefined
        ? API.DASHBOARD_LIST
        : `${API.DASHBOARD_LIST}?version=1.0.0&ibId=${this.searchInput}`;

    const getDeposits = (dateFrom: Date, dateTo: Date) => {
      this.isLoading = true;
      const dateformat = new Date();
      var date = dateformat ? dateformat : '';
      const body = {
        from: dateFrom != undefined ? dateFrom : date,
        to: dateTo != undefined ? dateTo : date,
        search: this.searchInput,
        currency: 'USD',
        onlyIsIb: this.showIBS,
        segment: {
          limit: 20,
          offset: this.limit,
        },
        sorting: {
          field: this.shortingField,
          direction: this.shortingDir,
        },
        withTotals: true,
      };

      return this.apiService.callApiPostRequest(APINameTransaction, body);
    };

    // Fetch withdrawals for start date
    getDeposits(lastYearSameDate, startDate).subscribe(
      (startRes: any) => {
        let startTotalDeposit = 0;
        let startTotalWithdrawal = 0;
        let startTotalLot = 0;
        let startTotalCommission = 0;
        console.log(startRes, 555);
        if (startRes) {
          if (startRes.referrals && startRes.referrals?.length > 0) {
            startTotalDeposit = startRes.totals.deposits;
            startTotalWithdrawal = startRes.totals.withdrawals;
            startTotalLot = startRes.totals.lots;
            startTotalCommission = startRes.totals.commission;
          }
        }

        console.log(startRes);
        // Fetch withdrawals for end date
        getDeposits(lastYearSameDate, endDate).subscribe(
          (endRes: any) => {
            // console.log(endRes);
            this.isLoading = false;
            let endTotalDeposit = 0;
            let endTotalWithdrawal = 0;
            let endTotalLot = 0;
            let endTotalCommission = 0;
            // let endTotalActiveClient = 0;
            if (endRes) {
              if (endRes.referrals && endRes.referrals?.length > 0) {
                endTotalDeposit = endRes.totals.deposits;
                endTotalWithdrawal = endRes.totals.withdrawals;
                endTotalLot = endRes.totals.lots;
                endTotalCommission = endRes.totals.commission;
                // endTotalActiveClient = endRes.totals.
              }
            }

            // Calculate percentage difference
            const percentageDifferenceDeposit =
              this.calculatePercentageDifference(
                startTotalDeposit,
                endTotalDeposit
              );
            const percentageDifferenceWithdrawal =
              this.calculatePercentageDifference(
                startTotalWithdrawal,
                endTotalWithdrawal
              );
            // const percentageDifferenceLot = this.calculatePercentageDifference(
            //   startTotalLot,
            //   endTotalLot
            // );
            //
            // const percentageDifferenceCommission =
            //   this.calculatePercentageDifference(
            //     startTotalCommission,
            //     endTotalCommission
            //   );

            // console.log('start Total Deposit: ', startTotalDeposit);
            // console.log('end Total Deposit: ', endTotalDeposit);
            this.percentageDifferenceDeposit =
              percentageDifferenceDeposit == -100
                ? percentageDifferenceDeposit * -1
                : percentageDifferenceDeposit;
            this.percentageDifference =
              percentageDifferenceWithdrawal == -100
                ? percentageDifferenceWithdrawal * -1
                : percentageDifferenceWithdrawal;
            this.isLoading = false;
          },
          (err: any) => {
            this.isLoading = false;
            this.toastrService.error(
              err.error.message ? err.error.message : 'something went wrong'
            );
          }
        );
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  // getSumTotalWithdraw() {
  //   const APINameTransaction = API.CLIENT_TRANSACTIONS_LIST + `?version=1.0.0`;
  //   const dateformat = new Date();
  //   const weekDate = new Date().setDate(new Date().getDate() - 30);
  //   const startDate = this.dashboardDateFrom
  //     ? this.dashboardDateFrom
  //     : weekDate;
  //   const endDate = this.dashboardDateTo ? this.dashboardDateTo : dateformat;
  //
  //   const getWithdrawals = (dateFrom: Date, dateTo: Date) => {
  //     const body = {
  //       tableConfig: {
  //         filters: [
  //           {
  //             field:
  //               'col_columndefinitions_typecolumndefinition_9c7e77b7ef3be7070a82993434e3fced',
  //             value: 'Withdrawal',
  //           },
  //           {
  //             field:
  //               'col_columndefinitions_processedatcolumndefinition_fae7040c4582b3b1b69f6026a3f2bffe',
  //             value: `${dateFrom},${dateTo}`,
  //           },
  //           {
  //             field: 'Account',
  //             modificator: 'Equals',
  //             value: [this.loginID],
  //           },
  //         ],
  //         segment: {
  //           limit: 20,
  //           offset: 0,
  //         },
  //         sorting: {
  //           field: this.shortingField,
  //           direction: this.shortingDir,
  //         },
  //         csv: false,
  //         withTotals: true,
  //       },
  //     };
  //
  //     return this.apiService.callApiPostRequest(APINameTransaction, body);
  //   };
  //
  //   this.isLoading = true;
  //
  //   // Fetch withdrawals for start date
  //   getWithdrawals(startDate, startDate).subscribe(
  //     (startRes: any) => {
  //       const startTotal = startRes.totals[Object.keys(startRes.totals)[0]];
  //
  //       // Fetch withdrawals for end date
  //       getWithdrawals(startDate, endDate).subscribe(
  //         (endRes: any) => {
  //           this.isLoading = false;
  //           const endTotal = endRes.totals[Object.keys(endRes.totals)[0]];
  //
  //           // Calculate percentage difference
  //           const percentageDifference = this.calculatePercentageDifference(
  //             startTotal,
  //             endTotal
  //           );
  //
  //           // Log the results or update the UI
  //           // console.log('Start Total:', startTotal);
  //           // console.log('End Total:', endRes);
  //           // console.log('Percentage Difference:', percentageDifference);
  //
  //           // You can also update the UI with these values
  //           this.StrTotalWithdrawal = new Intl.NumberFormat('en-US', {
  //             style: 'currency',
  //             currency: 'USD',
  //           }).format(endTotal);
  //
  //           this.percentageDifference = percentageDifference;
  //         },
  //         (err: any) => {
  //           this.isLoading = false;
  //           this.toastrService.error(
  //             err.error.message ? err.error.message : 'something went wrong'
  //           );
  //         }
  //       );
  //     },
  //     (err: any) => {
  //       this.isLoading = false;
  //       this.toastrService.error(
  //         err.error.message ? err.error.message : 'something went wrong'
  //       );
  //     }
  //   );
  // }

  /***** GET CHART DATA   *****/
  getChartData() {
    this.configApi();
    this.getSumTotalDeposit();
    this.getLCA();
    // this.getSumTotalWithdraw();
  }

  elementRow(item: any) {
    var finalValue = '';
    item.data.filter((item: any) => {
      if (item.key == 'level') {
        finalValue = 'd-none';
      }
    });
    return finalValue;
  }

  testValues(val: any) {
    let finalValue: any;
    if (val) {
      finalValue = Number(val).toFixed(2);
    } else {
      finalValue = 0.0;
    }
    return finalValue;
  }

  // shortingHandle(item: any) {
  //   if (this.shortingField == item.key) {
  //     this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : 'DESC'
  //   } else {
  //     this.shortingDir = 'ASC'
  //   }
  //   this.shortingField = item.key ? item.key : ''
  //   this.expand = "show";
  //   this.getDashboardList();
  //   // this.isExpandBtn();
  // }

  // getDashboardList() {
  //   this.isLoading = true;
  //   this.minusBtn = false;
  //   this.plushBtn = true;
  //   const dateformat = new Date();
  //   var date = dateformat ? dateformat : '';
  //   const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
  //   const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
  //   const body = {
  //     from: fromData != undefined ? fromData : date,
  //     to: toData != undefined ? toData : date,
  //     search: this.searchInput,
  //     currency: 'USD',
  //     onlyIsIb: this.showIBS,
  //     segment: {
  //       limit: 20,
  //       offset: this.limit,
  //     },
  //     withTotals: true,
  //   };

  //   body.from = moment(body.from).format('YYYY-MM-DD');
  //   body.to = moment(body.to).format('YYYY-MM-DD');

  //   // console.log(this.searchInput);

  //   const PROC_API =
  //     this.searchInput == undefined
  //       ? API.DASHBOARD_LIST
  //       : `${API.DASHBOARD_LIST}?version=1.0.0&ibId=${this.searchInput}`;

  //   this.apiService.callApiPostRequest(PROC_API, body).subscribe(
  //     (res: any) => {
  //       if (res) {
  //         this.isLoading = false;

  //         if (res.referrals && res.referrals?.length > 0) {
  //           this.dashboardList = this.dashboardList.concat(res.referrals);
  //           this.ibTotal = res.totals;
  //         } else {
  //           this.dashboardList = [];
  //         }

  //         // this.searchdashboardList = res
  //       }
  //     },
  //     (err: any) => {
  //       this.isLoading = false;
  //       this.toastrService.error(
  //         err.error.message ? err.error.message : 'something went wrong'
  //       );
  //     }
  //   );
  // }

  tableList(val: any) {
    if (val == 'transactions') {
      this.router.navigate(['/app/ib-transactions']);
    } else if (val == 'commission') {
      this.router.navigate(['/app/detailed-commission-breakdown']);
    }
  }

  groupReferralsStats(event: any) {
    this.isChecked = event.target.checked;
  }

  // getIbData() {
  //   const dateformat = new Date();
  //   this.isLoading = true;
  //   var date = dateformat ? dateformat : '';
  //   const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
  //   const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
  //   const body = {
  //     from: fromData != undefined ? fromData : date,
  //     to: toData != undefined ? toData : date,
  //     search: this.searchInput,
  //     currency: 'USD',
  //     onlyIsIb: true,
  //     segment: {
  //       limit: 20,
  //       offset: this.limit,
  //     },
  //     withTotals: true,
  //   };

  //   body.from = moment(body.from).format('YYYY-MM-DD');
  //   body.to = moment(body.to).format('YYYY-MM-DD');

  //   this.apiService.callApiPostRequest(API.DASHBOARD_LIST, body).subscribe(
  //     (res: any) => {
  //       if (res) {
  //         this.isLoading = false;

  //         if (res.referrals && res.referrals?.length > 0) {
  //           this.dashboardList = res.referrals;
  //           this.ibTotal = res.totals;
  //         } else {
  //           this.dashboardList = [];
  //         }
  //       }
  //     },
  //     (err: any) => {
  //       this.isLoading = false;
  //       this.toastrService.error(
  //         err.error.message ? err.error.message : 'something went wrong'
  //       );
  //     }
  //   );
  // }

  // filterManage(event: any) {
  //   // this.isLoading = true;
  //   // this.showIBS = !this.showIBS
  //   // console.log(this.showIBS)
  //   // setTimeout(() => {
  //   //   this.isLoading = false;
  //   // }, 3000);
  //   // if (this.minusBtn) {
  //   //   this.minusBtn = false;
  //   //   this.plushBtn = true;
  //   // }
  //   this.showIBS = event.target.checked;
  //   this.dashboardList = [];
  //   this.limit = 0;
  //   if (this.showIBS) {
  //     this.getIbData();
  //   } else {
  //     this.getDashboardList();
  //   }
  // }

  // searchHandle(event: any) {
  //   this.searchInput = event.target.value;
  //   this.dashboardList = [];
  //   this.limit = 0;
  //   if (this.searchInput.length > 2) {
  //     clearTimeout(this.typingTimer);
  //     this.typingTimer = setTimeout(() => {
  //       this.getDashboardList();
  //     }, 1000);
  //     this.minusBtn = false;
  //     this.plushBtn = true;
  //   }
  //   if (this.searchInput.length == 0) {
  //     clearTimeout(this.typingTimer);
  //     this.typingTimer = setTimeout(() => {
  //       this.getDashboardList();
  //     }, 1000);
  //     this.minusBtn = false;
  //     this.plushBtn = true;
  //   }
  // }

  // isCollapseBtn() {
  //   for (const [indexData, item] of this.dashboardList.entries()) {
  //     if (item.directCount > 0 && item.self == false) {
  //       item['isPlus'] = false;
  //       this.dashboardList = this.dashboardList.filter(function (item: any) {
  //         return item.parentIndex !== item.ibId;
  //       });
  //     }
  //   }
  // }

  // getAllSubList(ibId: any, index: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     const dateformat = new Date();
  //     this.isLoading = true;
  //     var date = dateformat ? dateformat : '';
  //     const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
  //     const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
  //     const body = {
  //       from: fromData != undefined ? fromData : date,
  //       to: toData != undefined ? toData : date,
  //       search: this.searchInput,
  //       currency: 'USD',
  //       ibId: ibId,
  //       withTotals: true,
  //       onlyIsIb: this.showIBS,
  //     };
  //     this.apiService.callApiPostRequest(API.DASHBOARD_LIST, body).subscribe(
  //       (res: any) => {
  //         this.isLoading = false;
  //         if (res && res.referrals && res.referrals.length > 0) {
  //           resolve({ ibId: ibId, referrals: res.referrals });
  //         } else {
  //           this.dashboardList = [];
  //           resolve([]); // Resolve with an empty array if there are no referrals
  //         }
  //       },
  //       (err: any) => {
  //         this.isLoading = false;
  //         this.toastrService.error(
  //           err.error.message ? err.error.message : 'something went wrong'
  //         );
  //         reject(err); // Reject the promise if there's an error
  //       }
  //     );
  //   });
  // }

  // async isExpandAllBtn(): Promise<any> {
  //   this.isCollapseBtn();
  //   let allArr: any = [];
  //   for (const [index, item] of this.dashboardList.entries()) {
  //     if (item.directCount > 0 && item.self == false) {
  //       const result = await this.getAllSubList(item.referralId, index);
  //       allArr.push(result);
  //     }
  //   }

  //   let finalIndex = 0;
  //   return new Promise<void>((resolve, reject) => {
  //     allArr.forEach(async (data: any) => {
  //       setTimeout(() => {
  //         let index = this.dashboardList.findIndex(
  //           (referral: any) => referral.referralId == data.ibId
  //         );
  //         this.dashboardList[index]['isPlus'] = true;
  //         data.referrals.forEach(async (item: any) => {
  //           item['parentIndex'] = item.ibId;

  //           await this.dashboardList.splice(index + 1, 0, item);
  //           if (item?.directCount > 0) {
  //             let index1 = this.dashboardList.findIndex(
  //               (referral: any) => referral.referralId == item.referralId
  //             );
  //             this.isSubExpandBtn(item?.referralId, index1, item?.isPlus);
  //           }
  //         });
  //       }, 100);
  //     });
  //     resolve();
  //   });
  // }

  // isSubExpandBtn(ibId: any, index: any, isPlus: any) {
  //   if (!isPlus) {
  //     this.getSubList(ibId, index);
  //   } else {
  //     this.dashboardList[index]['isPlus'] = false;
  //     this.dashboardList = this.dashboardList.filter(function (item: any) {
  //       return item.parentIndex !== ibId;
  //     });
  //   }
  // }

  // getSubList(ibId: any, index: any) {
  //   const dateformat = new Date();
  //   this.isLoading = true;
  //   var date = dateformat ? dateformat : '';
  //   const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date;
  //   const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
  //   const body = {
  //     from: fromData != undefined ? fromData : date,
  //     to: toData != undefined ? toData : date,
  //     search: this.searchInput,
  //     currency: 'USD',
  //     ibId: ibId,
  //     withTotals: true,
  //     onlyIsIb: this.showIBS,
  //   };
  //   this.apiService.callApiPostRequest(API.DASHBOARD_LIST, body).subscribe(
  //     (res: any) => {
  //       if (res) {
  //         this.isLoading = false;

  //         if (res.referrals && res.referrals?.length > 0) {
  //           // Create a copy of the original array to avoid mutating it directly
  //           this.dashboardList[index]['isPlus'] = true;
  //           res.referrals.forEach((item: any) => {
  //             item['parentIndex'] = ibId;
  //             this.dashboardList.splice(index + 1, 0, item);
  //           });
  //         } else {
  //           this.dashboardList = [];
  //         }
  //       }
  //     },
  //     (err: any) => {
  //       this.isLoading = false;
  //       this.toastrService.error(
  //         err.error.message ? err.error.message : 'something went wrong'
  //       );
  //     }
  //   );
  // }

  // getAccountList(ele: any) {
  //   const userAccID = ele.referralId;
  //   if (userAccID) {
  //     const modalInitialState = {
  //       userAccID: userAccID,
  //     } as Partial<IbDashboardShowComponent>;

  //     this.modalRef = this.bsModalService.show(IbDashboardShowComponent, {
  //       animated: true,
  //       backdrop: 'static',
  //       class: 'modal-dialog-centered modal-lg',
  //       initialState: modalInitialState,
  //     });
  //   }
  // }

  // loadmore() {
  //   this.limit = this.limit + 20;
  //   this.getDashboardList();
  // }

  // getAccountList(ele: any) {
  //   const userAccID = ele.referralId
  //   this.router.navigate([`app/ib-dashboard/show/${userAccID}`]);
  // }

  // formatDate(date: Date): string {
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //   const year = date.getFullYear();

  //   return `${month}/${day}/${year}`; // Change the format here
  // }

  pageHandle(val: any) {
    if (val == 'withdraw') {
      const userDetails: any = localStorage.getItem('boldUserDetail' || '');
      var user: any = JSON.parse(userDetails);

      const userAccess: any = user?.financialPermissions?.find(
        (x: any) => x == 'ib withdraw'
      );
      try {
        this.isLoading = true;
        this.apiService.callApiGetRequest(API.PROFILE, {}).subscribe(
          (res: any) => {
            if (res) {
              console.log(res, 5552);
              const userAccess: any = res?.financialPermissions?.find(
                (x: any) => x == 'ib withdraw'
              );
              if (userAccess) {
                this.router.navigate([`app/withdraw`]);
              } else {
                this.toastrService.error(
                  'This operation is not allowed',
                  'Admin paused this functionality for you'
                );
              }
              this.isLoading = false;
            }
          },
          (err: any) => {
            this.isLoading = false;
            this.toastrService.error(
              'This operation is not allowed',
              'Admin paused this functionality for you'
            );
          }
        );
      } catch (error) {
        console.error(error);
      }
    } else if (val == 'transferToTrading') {
      try {
        this.isLoading = true;
        this.apiService.callApiPostRequest(API.TRANSFER_LIST, null).subscribe(
          (res: any) => {
            if (res) {
              this.isLoading = false;
              this.router.navigate([`app/withdraw`]);
            }
          },
          (err: any) => {
            this.isLoading = false;
            this.toastrService.error(
              'This operation is not allowed',
              'Admin paused this functionality for you'
            );
          }
        );
      } catch (error) {
        console.error(error);
      }
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
    } else if (val == 'depositFunds') {
      const userDetails: any = localStorage.getItem('boldUserDetail' || '');
      var user: any = JSON.parse(userDetails);
      const userAccess: any = user?.financialPermissions?.find(
        (x: any) => x == 'ib transfer'
      );

      try {
        this.isLoading = true;
        this.apiService.callApiGetRequest(API.PROFILE, {}).subscribe(
          (res: any) => {
            if (res) {
              console.log(res, 5552);
              const userAccess: any = res?.financialPermissions?.find(
                (x: any) => x == 'ib transfer'
              );
              if (userAccess) {
                this.router.navigate([`app/deposit`]);
                this.modalRef = this.bsModalService.show(
                  TransferFundsComponent,
                  {
                    animated: true,
                    backdrop: 'static',
                    class: 'modal-dialog-centered modal-lg',
                    initialState: {},
                  }
                );
              } else {
                this.toastrService.error(
                  'This operation is not allowed',
                  'Admin paused this functionality for you'
                );
              }
              this.isLoading = false;
            }
          },
          (err: any) => {
            this.isLoading = false;
            this.toastrService.error(
              'This operation is not allowed',
              'Admin paused this functionality for you'
            );
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  isExpandBtn() {
    if (this.plushBtn) {
      this.plushBtn = false;
      this.minusBtn = true;
    } else {
      this.plushBtn = true;
      this.minusBtn = false;
    }
  }

  // task-1
  registerCharts() {
    if (this.registrationsData) {
      this.registrationsData.destroy();
    }

    // Calculate linear trendline
    const trendlineData = this.calculateLinearTrendline(
      this.registrationsDataX,
      this.registrationsDataY
    );

    this.registrationsData = new Chart('RegistrationCharts', {
      type: 'line',

      data: {
        labels: this.registrationsDataX,
        datasets: [
          {
            label: 'Registrations',
            data: this.registrationsDataY,
            backgroundColor: 'limegreen',
          },
          {
            label: 'Linear Trendline',
            data: trendlineData,
            borderColor: 'red',
            borderWidth: 1,
            fill: true,
            pointRadius: 0,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            cubicInterpolationMode: 'monotone',
          },
        },
      },
    });

    this.registrationsData.update();
  }

  /***** VOLUME CHARTS DATA MANAGE   *****/
  valueChart() {
    if (this.volumeData) {
      this.volumeData.destroy();
    }

    const trendlineData = this.calculateLinearTrendline(
      this.volumeDataX,
      this.volumeDataY
    );

    this.volumeData = new Chart('VolumeCharts', {
      type: 'line',

      data: {
        labels: this.volumeDataX,
        datasets: [
          {
            label: 'Volume (Lots)',
            data: this.volumeDataY,
            backgroundColor: 'orange',
          },
          {
            label: 'Linear Trendline',
            data: trendlineData,
            borderColor: 'red',
            borderWidth: 1,
            fill: true,
            pointRadius: 0,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            cubicInterpolationMode: 'monotone',
          },
        },
        scales: {
          y: {
            // Default ticks, no custom configuration
          },
        },
      },
    });

    this.volumeData.update();
  }

  calculateLinearTrendline(xData: any, yData: any) {
    const n = xData.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += new Date(xData[i]).getTime();
      sumY += yData[i];
      sumXY += new Date(xData[i]).getTime() * yData[i];
      sumXX += new Date(xData[i]).getTime() * new Date(xData[i]).getTime();
    }

    const denominator = n * sumXX - sumX * sumX;

    if (denominator === 0) {
      console.error('Denominator is zero. Unable to calculate trendline.');
      return [];
    }

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    const trendlineData = [];
    for (let i = 0; i < n; i++) {
      let trendData = slope * new Date(xData[i]).getTime() + intercept;
      if (trendData >= 0) trendlineData.push(trendData);
    }

    return trendlineData;
  }

  /***** COMMISSIONS CHARTS DATA MANAGE   *****/
  commCharts() {
    if (this.CommissionsChart) {
      this.CommissionsChart.destroy();
    }

    const trendlineData = this.calculateLinearTrendline(
      this.CommissionsDataX,
      this.CommissionsDataY
    );

    this.CommissionsChart = new Chart('commissionsCharts', {
      type: 'line',

      data: {
        labels: this.CommissionsDataX,
        datasets: [
          {
            label: 'Commissions (USD)',
            data: this.CommissionsDataY,
            backgroundColor: '#2196F3',
          },
          {
            label: 'Linear Trendline',
            data: trendlineData,
            borderColor: 'red',
            borderWidth: 1,
            fill: true,
            pointRadius: 0,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            cubicInterpolationMode: 'monotone',
          },
        },
        scales: {
          y: {
            ticks: {
              // Automatically vary the tick values
              callback: function (value) {
                return value; // Show all values
              },
              // Set stepSize to control the interval between ticks
              stepSize: 10, // Adjust as needed to control tick density
            },
          },
        },
      },
    });

    this.CommissionsChart.update();
  }

  /***** CHART DATA MANAGE   *****/
  chartDataHandle(data: any, label: any) {
    var optoionDataX: any = [];
    var optoionDataY: any = [];

    for (let index = 0; index < data.length; index++) {
      const el = data[index];
      optoionDataX.push(el.x);
      optoionDataY.push(el.y);
    }
    if (label == 'Commissions (USD)') {
      this.CommissionsDataX = optoionDataX;
      this.CommissionsDataY = optoionDataY;
      this.commCharts();
    } else if (label == 'Volume (Lots)') {
      this.volumeDataX = optoionDataX;
      this.volumeDataY = optoionDataY;
      this.valueChart();
    } else if (label == 'Registrations') {
      this.registrationsDataX = optoionDataX;
      this.registrationsDataY = optoionDataY;
      this.registerCharts();
    }
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
          // this.balanceAmount = '0.00';
          this.loginID = res[0]?.login;
          this.loginSid = res[0]?.loginSid;

          // this.getSumTotalWithdraw();
          this.getSumTotalDeposit();
          this.getLCA();
        }
      },
      (err: any) => {
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  /***** REFERRAL INFO CHARTS DATA MANAGE   *****/
  elementCanvas(parent: any, element: any, id: any) {
    const width = 400;
    const height = 450;

    element.remove();
    if (parent) {
      const existingCanvas = document.getElementById(id);
      if (existingCanvas) {
        existingCanvas.remove();
      }
      const canvasElement = document.createElement('canvas');
      canvasElement.id = id;
      canvasElement.width = width;
      canvasElement.height = height;
      parent.appendChild(canvasElement);
    }
  }

  referralInfoHandle(tReg: any) {
    const elementRemove = document.getElementById('emptyReferralInfo');
    const parentElement = document.getElementById('referralInfoDoughnut');
    const id = 'referralInfoChart';
    this.totalReg = tReg;
    if (tReg > 0) {
      if (elementRemove) {
        this.elementCanvas(parentElement, elementRemove, id);
        // this.getReferralInfoChart();
      } else {
        // this.getReferralInfoChart();
      }
    }
  }

  getReferralInfoChart() {
    if (this.referralInfo) {
      this.referralInfo.destroy();
    }

    this.referralInfo = new Chart('referralInfoChart', {
      type: 'doughnut',
      data: {
        labels: ['Registered (' + this.totalReg + ')'],
        datasets: [
          {
            data: [this.totalReg],
            backgroundColor: ['#5ad1ec'],
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              boxWidth: 6,
            },
          },
          datalabels: {
            color: '#000000',
            formatter: (value: any, ctx: any) => {
              console.log(ctx);
              console.log(value);
              let label = ctx.chart.data.labels[ctx.dataIndex];
              return label;
            },
            font: {
              size: 16,
            },
            anchor: 'end',
            align: 'start',
            offset: -20,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        aspectRatio: 1.1,
      },
    });

    this.referralInfo.update();
  }

  /***** TOP TRADING INSTRUMENTS CHARTS DATA MANAGE   *****/

  convertArrayToNumbers(arr: any[]): number[] {
    const result: number[] = [];

    for (const item of arr) {
      const num = parseFloat(item);
      if (!isNaN(num)) {
        result.push(num);
      }
    }

    return result;
  }

  sumArray(numbers: number[]): number {
    let sum = 0;

    for (const num of numbers) {
      sum += num;
    }

    return sum;
  }

  sortDescendingByValue(arr: Pair[]): Pair[] {
    return arr.sort((a, b) => b.value - a.value);
  }

  calculatePercentages(arr: number[]): number[] {
    const total = arr.reduce((sum, current) => sum + current, 0);
    return arr.map((value) => (value / total) * 100);
  }

  extractDecimalPercentage(arr: number[]): number[] {
    return arr.map((value) => {
      const decimal = value.toFixed(2);
      return parseFloat(decimal);
    });
  }

  tradingInstrumentsHandle(data: any) {
    // fill here
    console.log('show chart 3 ', data);
    if (data == 'error') {
      return;
    } else {
      
      let tXAUUSD = [];
      let tUSDJPY = [];
      let tAUDCHF = [];
      let tAUDUSD = [];
      let tGBPUSD = [];
      let tUSDCAD = [];
      let tUSDCHF = [];
      let tEURUSD = [];
      let tEURGBP = [];
      let tGBPAUD = [];
      let tAUDCAD = [];
      let tGBPJPY = [];
      let tEURJPY = [];
      let tETHUSD = [];
      let tCADJPY = [];
      let tEURAUD = [];
      let tNZDUSD = [];
      let tCADCHF = [];

      if (data.rows.length > 0) {
        for (const q of data.rows) {
          const lots = q.data[2].value;
          const symbol = q.data[3].value;
          const date = q.data[4].value;
          const convertDate = new Date(moment(date).format('DD-MM-YYYY'));
          const fromDate = moment(this.dateRangeFrom, 'DD-MM-YYYY').toDate();
          const toDate = moment(this.dateRangeTo, 'DD-MM-YYYY').toDate();

          if (convertDate >= fromDate && convertDate <= toDate) {
            if (symbol === 'XAUUSD.' || symbol === 'XAUUSD') {
              tXAUUSD.push(lots);
            } else if (symbol === 'USDJPY.' || symbol === 'USDJPY') {
              tUSDJPY.push(lots);
            } else if (symbol === 'AUDCHF.' || symbol === 'AUDCHF') {
              tAUDCHF.push(lots);
            } else if (symbol === 'AUDUSD.' || symbol === 'AUDUSD') {
              tAUDUSD.push(lots);
            } else if (symbol === 'GBPUSD.' || symbol === 'GBPUSD') {
              tGBPUSD.push(lots);
            } else if (symbol === 'USDCAD.' || symbol === 'USDCAD') {
              tUSDCAD.push(lots);
            } else if (symbol === 'USDCHF.' || symbol === 'USDCHF') {
              tUSDCHF.push(lots);
            } else if (symbol === 'EURUSD.' || symbol === 'EURUSD') {
              tEURUSD.push(lots);
            } else if (symbol === 'EURGBP.' || symbol === 'EURGBP') {
              tEURGBP.push(lots);
            } else if (symbol === 'GBPAUD.' || symbol === 'GBPAUD') {
              tGBPAUD.push(lots);
            } else if (symbol === 'AUDCAD.' || symbol === 'AUDCAD') {
              tAUDCAD.push(lots);
            } else if (symbol === 'GBPJPY.' || symbol === 'GBPJPY') {
              tGBPJPY.push(lots);
            } else if (symbol === 'EURJPY.' || symbol === 'EURJPY') {
              tEURJPY.push(lots);
            } else if (symbol === 'ETHUSD.' || symbol === 'ETHUSD') {
              tETHUSD.push(lots);
            } else if (symbol === 'CADJPY.' || symbol === 'CADJPY') {
              tCADJPY.push(lots);
            } else if (symbol === 'EURAUD.' || symbol === 'EURAUD') {
              tEURAUD.push(lots);
            } else if (symbol === 'NZDUSD.' || symbol === 'NZDUSD') {
              tNZDUSD.push(lots);
            } else if (symbol === 'CADCHF.' || symbol === 'CADCHF') {
              tCADCHF.push(lots);
            } else {
              // console.log(symbol);
            }
          }
        }
      }

      const tXAUUSDnumbers = this.convertArrayToNumbers(tXAUUSD);
      const tXAUUSDdecimalOccurrences = this.sumArray(tXAUUSDnumbers);

      const tUSDJPYnumbers = this.convertArrayToNumbers(tUSDJPY);
      const tUSDJPYdecimalOccurrences = this.sumArray(tUSDJPYnumbers);

      const tAUDCHFnumbers = this.convertArrayToNumbers(tAUDCHF);
      const tAUDCHFdecimalOccurrences = this.sumArray(tAUDCHFnumbers);

      const tAUDUSDnumbers = this.convertArrayToNumbers(tAUDUSD);
      const tAUDUSDdecimalOccurrences = this.sumArray(tAUDUSDnumbers);

      const tGBPUSDnumbers = this.convertArrayToNumbers(tGBPUSD);
      const tGBPUSDdecimalOccurrences = this.sumArray(tGBPUSDnumbers);

      const tUSDCADnumbers = this.convertArrayToNumbers(tUSDCAD);
      const tUSDCADdecimalOccurrences = this.sumArray(tUSDCADnumbers);

      const tUSDCHFnumbers = this.convertArrayToNumbers(tUSDCHF);
      const tUSDCHFdecimalOccurrences = this.sumArray(tUSDCHFnumbers);

      const tEURUSDnumbers = this.convertArrayToNumbers(tEURUSD);
      const tEURUSDdecimalOccurrences = this.sumArray(tEURUSDnumbers);

      const tEURGBPnumbers = this.convertArrayToNumbers(tEURGBP);
      const tEURGBPdecimalOccurrences = this.sumArray(tEURGBPnumbers);

      const tGBPAUDnumbers = this.convertArrayToNumbers(tGBPAUD);
      const tGBPAUDdecimalOccurrences = this.sumArray(tGBPAUDnumbers);

      const tAUDCADnumbers = this.convertArrayToNumbers(tAUDCAD);
      const tAUDCADdecimalOccurrences = this.sumArray(tAUDCADnumbers);

      const tGBPJPYnumbers = this.convertArrayToNumbers(tGBPJPY);
      const tGBPJPYdecimalOccurrences = this.sumArray(tGBPJPYnumbers);

      const tEURJPYnumbers = this.convertArrayToNumbers(tEURJPY);
      const tEURJPYdecimalOccurrences = this.sumArray(tEURJPYnumbers);

      const tETHUSDnumbers = this.convertArrayToNumbers(tETHUSD);
      const tETHUSDdecimalOccurrences = this.sumArray(tETHUSDnumbers);

      const tCADJPYnumbers = this.convertArrayToNumbers(tCADJPY);
      const tCADJPYdecimalOccurrences = this.sumArray(tCADJPYnumbers);

      const tEURAUDnumbers = this.convertArrayToNumbers(tEURAUD);
      const tEURAUDdecimalOccurrences = this.sumArray(tEURAUDnumbers);

      const tNZDUSDnumbers = this.convertArrayToNumbers(tNZDUSD);
      const tNZDUSDdecimalOccurrences = this.sumArray(tNZDUSDnumbers);

      const tCADCHFnumbers = this.convertArrayToNumbers(tCADCHF);
      const tCADCHFdecimalOccurrences = this.sumArray(tCADCHFnumbers);

      if (
        tXAUUSDdecimalOccurrences == 0 &&
        tUSDJPYdecimalOccurrences == 0 &&
        tAUDCHFdecimalOccurrences == 0 &&
        tAUDUSDdecimalOccurrences == 0 &&
        tGBPUSDdecimalOccurrences == 0 &&
        tUSDCADdecimalOccurrences == 0 &&
        tUSDCHFdecimalOccurrences == 0 &&
        tEURUSDdecimalOccurrences == 0 &&
        tEURGBPdecimalOccurrences == 0 &&
        tGBPAUDdecimalOccurrences == 0 &&
        tAUDCADdecimalOccurrences == 0 &&
        tGBPJPYdecimalOccurrences == 0 &&
        tEURJPYdecimalOccurrences == 0 &&
        tETHUSDdecimalOccurrences == 0 &&
        tCADJPYdecimalOccurrences == 0 &&
        tEURAUDdecimalOccurrences == 0 &&
        tNZDUSDdecimalOccurrences == 0 &&
        tCADCHFdecimalOccurrences == 0
      ) {
        // return;
      }

      const elementRemove = document.getElementById('emptyTopTrading');
      const parentElement = document.getElementById('topTradingInstrumentsPie');
      const id = 'topTradingInstrumentsChart';
      console.log('show cart 2');
      if (elementRemove) {
        this.elementCanvas(parentElement, elementRemove, id);
      }

      const percentage: number[] = [
        tXAUUSDdecimalOccurrences,
        tUSDJPYdecimalOccurrences,
        tAUDCHFdecimalOccurrences,
        tAUDUSDdecimalOccurrences,
        tGBPUSDdecimalOccurrences,
        tUSDCADdecimalOccurrences,
        tUSDCHFdecimalOccurrences,
        tEURUSDdecimalOccurrences,
        tEURGBPdecimalOccurrences,
        tGBPAUDdecimalOccurrences,
        tAUDCADdecimalOccurrences,
        tGBPJPYdecimalOccurrences,
        tEURJPYdecimalOccurrences,
        tETHUSDdecimalOccurrences,
        tCADJPYdecimalOccurrences,
        tEURAUDdecimalOccurrences,
        tNZDUSDdecimalOccurrences,
        tCADCHFdecimalOccurrences,
      ];

      const percentageResult = this.calculatePercentages(percentage);

      const percentageDecimals: number[] = percentageResult;
      const extractedDecimals =
        this.extractDecimalPercentage(percentageDecimals);

      const array: Pair[] = [
        { stringVal: 'XAUUSD', value: tXAUUSDdecimalOccurrences },
        { stringVal: 'USDJPY', value: tUSDJPYdecimalOccurrences },
        { stringVal: 'AUDCHF', value: tAUDCHFdecimalOccurrences },
        { stringVal: 'AUDUSD', value: tAUDUSDdecimalOccurrences },
        { stringVal: 'GBPUSD', value: tGBPUSDdecimalOccurrences },
        { stringVal: 'USDCAD', value: tUSDCADdecimalOccurrences },
        { stringVal: 'USDCHF', value: tUSDCHFdecimalOccurrences },
        { stringVal: 'EURUSD', value: tEURUSDdecimalOccurrences },
        { stringVal: 'EURGBP', value: tEURGBPdecimalOccurrences },
        { stringVal: 'GBPAUD', value: tGBPAUDdecimalOccurrences },
        { stringVal: 'AUDCAD', value: tAUDCADdecimalOccurrences },
        { stringVal: 'GBPJPY', value: tGBPJPYdecimalOccurrences },
        { stringVal: 'EURJPY', value: tEURJPYdecimalOccurrences },
        { stringVal: 'ETHUSD', value: tETHUSDdecimalOccurrences },
        { stringVal: 'CADJPY', value: tCADJPYdecimalOccurrences },
        { stringVal: 'EURAUD', value: tEURAUDdecimalOccurrences },
        { stringVal: 'NZDUSD', value: tNZDUSDdecimalOccurrences },
        { stringVal: 'CADCHF', value: tCADCHFdecimalOccurrences },
      ];

      const newArray = extractedDecimals;

      if (newArray.length !== array.length) {
        console.log(
          'The length of the new array does not match the number of key-value pairs in the JSON.'
        );
      } else {
        for (let i = 0; i < array.length; i++) {
          array[i].value = newArray[i];
        }
      }

      let sortedArray = this.sortDescendingByValue(array);

      let otherPercentage = [];

      for (const key in sortedArray) {
        if (parseInt(key) > 4) {
          otherPercentage.push(sortedArray[key].value);
        }
      }

      let totalPercentageAll = this.sumArray(extractedDecimals);
      let otherPercentageAll = this.sumArray(otherPercentage);
      let resultOtherPercentage =
        (otherPercentageAll / totalPercentageAll) * 100;
      let sortedOtherOercentage = parseFloat(resultOtherPercentage.toFixed(2));

      this.otherPercentage = sortedOtherOercentage;
      this.totalPercentages = sortedArray;

      console.log(sortedArray, otherPercentage);
      this.getTopTradingInstrumentsChart();
    }
  }

  getTopTradingInstrumentsChart() {
    console.log(this.totalPercentages);
    if (this.topTradingInstruments) {
      this.topTradingInstruments.destroy();
    }

    this.topTradingInstruments = new Chart('topTradingInstrumentsChart', {
      type: 'pie',
      data: {
        labels: [
          this.totalPercentages[0]['stringVal'] +
            ' ' +
            '(' +
            (isNaN(this.totalPercentages[0]['value'])
              ? 0
              : this.totalPercentages[0]['value']) +
            ')' +
            '%',
          this.totalPercentages[1]['stringVal'] +
            ' ' +
            '(' +
            (isNaN(this.totalPercentages[1]['value'])
              ? 0
              : this.totalPercentages[1]['value']) +
            ')' +
            '%',
          this.totalPercentages[2]['stringVal'] +
            ' ' +
            '(' +
            (isNaN(this.totalPercentages[2]['value'])
              ? 0
              : this.totalPercentages[2]['value']) +
            ')' +
            '%',
          this.totalPercentages[3]['stringVal'] +
            ' ' +
            '(' +
            (isNaN(this.totalPercentages[3]['value'])
              ? 0
              : this.totalPercentages[3]['value']) +
            ')' +
            '%',
          this.totalPercentages[4]['stringVal'] +
            ' ' +
            '(' +
            (isNaN(this.totalPercentages[4]['value'])
              ? 0
              : this.totalPercentages[4]['value']) +
            ')' +
            '%',
          'OTHERS' +
            ' ' +
            '(' +
            (isNaN(this.otherPercentage) ? 0 : this.otherPercentage) +
            ')' +
            '%',
        ],
        datasets: [
          {
            data: [
              isNaN(
                this.totalPercentages[0]['value']
                  ? 0
                  : this.totalPercentages[0]['value']
              ),
              isNaN(this.totalPercentages[1]['value'])
                ? 0
                : this.totalPercentages[1]['value'],
              isNaN(this.totalPercentages[2]['value'])
                ? 0
                : this.totalPercentages[2]['value'],
              isNaN(this.totalPercentages[3]['value'])
                ? 0
                : this.totalPercentages[3]['value'],
              isNaN(this.totalPercentages[4]['value'])
                ? 0
                : this.totalPercentages[4]['value'],
              isNaN(this.otherPercentage) ? 0 : this.otherPercentage,
            ],
            backgroundColor: [
              '#01b9db',
              '#14bcef',
              '#62dce7',
              '#c33099',
              '#ffcd70',
              '#e9e37a',
            ],
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              boxWidth: 6,
            },
          },
          datalabels: {
            color: '#000000',
            formatter: (value: any, ctx: any) => {
              let label = ctx.chart.data.labels[ctx.dataIndex];
              //   return;
              // }
              return label;
            },
            font: {
              size: 16,
            },
            anchor: 'end',
            align: 'start',
            offset: -20,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        aspectRatio: 1.1,
      },
    });
    this.topTradingInstruments.update();
  }

  checkWithdraw() {
    const userDetails: any = localStorage.getItem('boldUserDetail' || '');
    var user: any = JSON.parse(userDetails);
    const userAccess: any = user?.financialPermissions?.find(
      (x: any) => x == 'ib withdraw'
    );
    // console.log(userAccess, 515151);
    if (userAccess) {
      this.canWithdraw = true;
    } else {
      this.canWithdraw = true;
    }
  }
  canTransfer: any;

  checkTransfer() {
    const userDetails: any = localStorage.getItem('boldUserDetail' || '');
    var user: any = JSON.parse(userDetails);
    const userAccess: any = user?.financialPermissions?.find(
      (x: any) => x == 'ib transfer'
    );

    // console.log(userAccess, 515151);
    if (userAccess) {
      this.canTransfer = true;
    } else {
      this.canTransfer = true;
    }
  }
}
