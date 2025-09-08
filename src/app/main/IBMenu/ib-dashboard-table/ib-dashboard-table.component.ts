import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TransferFundsComponent } from 'src/app/shared/modals/transfer-funds/transfer-funds.component';
import { IbDashboardShowComponent } from '../ib-dashboard/ib-dashboard-show/ib-dashboard-show.component';
import { Title } from '@angular/platform-browser';
import {DownloadCSVFileService} from "../../../shared/services/download-csvfile.service";
import { filter } from 'rxjs';

@Component({
  selector: 'app-ib-dashboard-table',
  templateUrl: './ib-dashboard-table.component.html',
  styleUrls: ['./ib-dashboard-table.component.scss']
})
export class IbDashboardTableComponent {
  // bsValue:any = new Date();
  // bsRangeValue:any;
  // maxDate:any = new Date();
  filterMenu: any = [];
  modalRef: any;
  showIBS: any = false;
  showTotals: boolean = false;
    lotsTotal: number = 0;
  balanceTotal: number = 0;
  equityTotal: number = 0;
  depositTotal: number = 0;
  withdrawalTotal: number = 0;
  commissionTotal: number = 0;
  isLoading: any = false;
  dashboardList: any = [];
  dashboardDateTo: any;
  dashboardDateFrom: any;
  filterHideShow: any = false;
  filterCol: any = [];
  ibTotal: any;
  filterRadio: any = [
    { name: 'Contains', value: 'Contains' },
    { name: 'Not Contains', value: 'Not Contains' },
    { name: 'Equals', value: 'Equals' },
    { name: 'Starts With', value: 'Starts With' },
    { name: 'Ends With', value: 'Ends With' },
    { name: '(Blank)', value: '(Blank)' },
    { name: '(Not Blank)', value: '(Not Blank)' },
  ]

  dashboardListRows = [
    { name: 'Name', key: 'firstName' },
    { name: 'Level', key: 'level' },
    { name: 'Balance, USD', key: 'balance' },
    { name: 'Equity, USD', key: 'equity' },
    { name: 'Deposits, USD', key: 'deposits' },
    { name: 'Withdrawals, USD', key: 'withdrawals' },
    { name: 'Lots', key: 'lots' },
    { name: 'Commission, USD', key: 'commission' },
    { name: 'Country', key: 'country' },
    { name: '' },
  ]

  // shorting
  shortingField: any = '';
  shortingDir: any = '';


  constructor(
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    public bsModalService: BsModalService,
    private toastrService: ToastrService,
    private titleService: Title,
    private downloadCSVFileService: DownloadCSVFileService,
  ) {
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('dashboard-referrals');
    this.commonService.pageName = 'Dashboard Referrals';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getDashboardList()
    const date = new Date();
    const weekDate = new Date(date.getFullYear(), date.getMonth(), 1)
    this.dashboardDateFrom = moment(weekDate).format('YYYY-MM-DD')
    this.dashboardDateTo = moment(date).format('YYYY-MM-DD')
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

  maxDate() {
    const maxDate = new Date()
    return maxDate;
  }

  /***** CURRENCY MANAGE  *****/
  currencyFor(val: any) {
    const value = val ? Number(val).toFixed(2) : '0.00'
    return value;
  }

  elementRow(item: any) {
    var finalValue = ''
    item.data.filter((item: any) => {
      if (item.key == "level") {
        finalValue = 'd-none'
      }
    })
    return finalValue
  }


  filterSearchValue(event: any, index: any) {
    this.filterMenu[index].value = event.target.value
  }

  toggleShowTotals() {
    this.isLoading = true;
    this.getDashboardList();
    this.showTotals = true;
  }

  exportToCsv(jsonData: any[], fileName: string): void {
    if (!jsonData || jsonData.length === 0) {
      console.error('No data provided for CSV export');
      return;
    }

    const header = Object.keys(jsonData[0]).join(','); // Extract CSV headers
    const csvRows = jsonData.map(row =>
      Object.values(row)
        .map(value => `"${value}"`) // Handle commas and quotes
        .join(',')
    );

    const csvContent = `${header}\n${csvRows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger file download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  public exportCSVFile(): void {
    if (this.dashboardList.length > 0) {
      console.log(this.dashboardList);
      this.isLoading = true;
      this.exportToCsv(this.dashboardList, 'ExportFile');
      this.isLoading = false;
      // const dateformat = new Date()
      // var date = dateformat ? dateformat : '';
      // const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date
      // const toData = this.dashboardDateTo ? this.dashboardDateTo : date
      // const body = {
      //   from: fromData != undefined ? fromData : date,
      //   to: toData != undefined ? toData : date,
      //   currency: "USD",
      //   tableConfig: {
      //     filters: [
      //       {
      //         field: "",
      //         modificator: "",
      //         value: ""
      //       }
      //     ],
      //     segment: {
      //       limit: "1000",
      //       offset: 0
      //     },
      //     sorting: {
      //       field: this.shortingField,
      //       direction: this.shortingDir
      //     },
      //     csv: true,
      //     withTotals: false
      //   }
      // }

      //  this.downloadCSVFileService.downloadFile(API.DASHBOARD_LIST, body)
      //   .subscribe((response: any) => {
      //     console.log(response);
      //     if (response.status == 200 || response.ok == true) {
      //       this.isLoading = false;

      //       // Parse the JSON response body to extract referral data
      //       const jsonData = response.body;  // Assuming response.body contains JSON data
      //       const referrals: Array<{
      //         ibId: number,
      //         referralId: number,
      //         level: number,
      //         levelName: string,
      //         fullName: string,
      //         isIb: boolean,
      //         directCount: number,
      //         totalCount: number,
      //         values: {
      //           balance: number,
      //           commission: number,
      //           country: string,
      //           deposits: number,
      //           equity: number,
      //           firstName: string,
      //           lastName: string,
      //           lots: number,
      //           withdrawals: number
      //         }
      //       }> = jsonData.referrals;

      //       // Define the CSV columns based on referral data structure
      //       const headers = ['ibId', 'referralId', 'level', 'levelName', 'fullName', 'isIb', 'directCount', 'totalCount', 'balance', 'commission', 'country', 'deposits', 'equity', 'firstName', 'lastName', 'lots', 'withdrawals'];

      //       // Convert JSON data to CSV
      //       let csvContent = headers.join(',') + '\n';
      //       referrals.forEach((referral) => {
      //         const values = referral.values;
      //         const row = [
      //           referral.ibId,
      //           referral.referralId,
      //           referral.level,
      //           referral.levelName,
      //           referral.fullName,
      //           referral.isIb,
      //           referral.directCount,
      //           referral.totalCount,
      //           values.balance || '',
      //           values.commission || '',
      //           values.country || '',
      //           values.deposits || '',
      //           values.equity || '',
      //           values.firstName || '',
      //           values.lastName || '',
      //           values.lots || '',
      //           values.withdrawals || ''
      //         ];
      //         csvContent += row.join(',') + '\n';
      //       });

      //       // Download the CSV file
      //       const blob = new Blob([csvContent], { type: 'text/csv' });
      //       const fileName = 'Export_Referrals.csv';
      //       const link = document.createElement('a');
      //       link.href = window.URL.createObjectURL(blob);
      //       link.download = fileName;
      //       link.click();
      //     } else {
      //       this.isLoading = false;
      //     }
      //   });

    } else {
      this.isLoading = false;
      this.toastrService.error('No data found');
    }
  }

  // filterInputValue(item: any, index: any) {
  //   this.filterMenu[index].modificator = item;
  // }

  filterInputValue(item: any, index: any) {
    const currentModificator = this.filterMenu[index].modificator;

    // If the clicked radio button is already selected, unselect it
    if (currentModificator === item) {
      this.filterMenu[index].modificator = null;
    } else {
      // Otherwise, select the clicked radio button
      this.filterMenu[index].modificator = item;
    }
  }

  filterRemove() {
    this.filterHideShow = this.filterHideShow == true ? false : false;
  }

  filterHandle() {
    this.filterHideShow = !this.filterHideShow;
  }


  resetFilter() {
    this.filterMenu = [];
    this.isLoading = true;
    for (let index = 0; index < this.filterCol.length; index++) {
      const element = this.filterCol[index]
      if (index == 0 || index == 1 || index == 2 || index == 4 || index == 5 || index == 7) {
        this.filterMenu.push({
          field: element.key,
          fields: element.title,
          modificator: '',
          value: ''
        })
      }

    }
    this.isLoading = false;
    this.filterHideShow = false;
    // this. 
    this.getDashboardList();
  }

  applyFilter() 
  {
    this.isLoading = true;
    var filterData = this.filterMenu.filter((item: any) => item.value != '' || item.modificator != '');
    const dateformat = new Date();
    var date = dateformat ? dateformat : '';
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date
    const toData = this.dashboardDateTo ? this.dashboardDateTo : date;
  
    const body = {
      from: fromData != undefined ? fromData : date,
      to: toData != undefined ? toData : date,
      currency: "USD",
      tableConfig: {
        filters: filterData,
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
    this.apiService.callApiPostRequest(API.DASHBOARD_LIST_REF, body).subscribe((res: any) => {
      if (res) {
        this.filterCol = res.columns
        this.dashboardList = res;
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
    this.isLoading = false;
    this.filterHideShow = false;
  }
  
  getDashboardListTotal() {
    this.isLoading = true;
    const dateformat = new Date()
    var date = dateformat ? dateformat : '';
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date
    const toData = this.dashboardDateTo ? this.dashboardDateTo : date
    const body = {
      from: fromData != undefined ? fromData : date,
      to: toData != undefined ? toData : date,
      currency: "USD",
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
          field:  this.shortingField,
          direction: this.shortingDir
        },
        csv: false,
        withTotals: false
      }
    } 
    this.apiService.callApiPostRequest(API.DASHBOARD_LIST, body).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        console.log(res);
        if (res.referrals && res.referrals?.length > 0) {
           
          res.referrals.forEach((val: any) => {
            const valuesRow = res.referrals[0].values._total_; 
            this.balanceTotal  = valuesRow.balance;
            this.equityTotal = valuesRow.equity;
            this.depositTotal = valuesRow.deposits;
            this.withdrawalTotal = valuesRow.withdrawals;
            this.lotsTotal = valuesRow.lots;
              this.commissionTotal = valuesRow.commission; 
          }); 
        }
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  getDashboardList() {
    this.isLoading = true;
    const dateformat = new Date()
    var date = dateformat ? dateformat : '';
    const fromData = this.dashboardDateFrom ? this.dashboardDateFrom : date
    const toData = this.dashboardDateTo ? this.dashboardDateTo : date
    const body = {
      from: fromData != undefined ? fromData : date,
      to: toData != undefined ? toData : date,
      currency: "USD",
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
          field:  this.shortingField,
          direction: this.shortingDir
        },
        csv: false,
        withTotals: false
      }
    } 
    this.apiService.callApiPostRequest(API.DASHBOARD_LIST_REF, body).subscribe((res: any) => {
      if (res) {
        this.isLoading = false; 
        console.log(res);
        for (let index = 0; index < res.columns.length; index++) {
          const element = res.columns[index];
          this.filterMenu.push({
            field: element.key,
            fields: element.title,
            modificator: null,
            value: '',
          });
        } 
          this.dashboardList = res;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })

    this.getDashboardListTotal();
  }

  searchHandle(event: any) {

  }

  filteredData = [...this.dashboardList];
  searchData(searchTerm: string): void {
    this.filteredData = this.dashboardList.filter((item: any) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.values.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  sortDataByValue(key: string, order: 'ASC' | 'DESC' = 'ASC'): void {
    this.filteredData.sort((a: any, b: any) => {
      const valueA = a.values[key];
      const valueB = b.values[key];
      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }
      return order === 'ASC' ? comparison : -comparison;
    });
  }

  shortingHandle(item: any) {
    console.log(item);
    if (this.shortingField == item.key) {
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : 'DESC'
    } else {
      this.shortingDir = 'ASC'
    }
    this.shortingField = item.key ? item.key : '';
    // const nameSorting = item.name == 'Name' ? 'firstName' : item.name.toLowerCase();
    console.log(this.shortingDir);
    this.getDashboardList();
    // this.sortDataByValue(this.shortingField, this.shortingDir);
  }


  tableList(val: any) {
    if (val == 'transactions') {
      this.router.navigate(['/app/ib-transactions']);
    } else if (val == 'commission') {
      this.router.navigate(['/app/detailed-commission-breakdown']);
    }

  }

  // getAccountList(ele: any) {
  //   // const userAccID = ele.data[0].value
  //   // this.router.navigate([`app/ib-dashboard/show/${userAccID}`]);
  //   const userAccID = ele.referralId
  //   this.router.navigate([`app/ib-dashboard/show/${userAccID}`]);
  // }

  getAccountList(ele: any) {
    const userAccID = ele.referralId;
    if (userAccID) {
      const modalInitialState = {
        userAccID: userAccID,
      } as Partial<IbDashboardShowComponent>;

      this.modalRef = this.bsModalService.show(IbDashboardShowComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-lg',
        initialState: modalInitialState,
      });
    }
  }

  dateRangePiker(val: any, title: any) {
    if (title == 'from') {
      this.dashboardDateFrom = val
    } else if (title == 'to') {
      this.dashboardDateTo = val
    }

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
        },
      });
    }
  }

  closeFilter(){
    this.filterHideShow = !this.filterHideShow
  }
}

