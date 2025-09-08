import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DownloadCSVFileService } from 'src/app/shared/services/download-csvfile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ib-transactions',
  templateUrl: './ib-transactions.component.html',
  styleUrls: ['./ib-transactions.component.scss'],
})
export class IbTransactionsComponent {
  isLoading: any = false;

  transactionsList: any = [];
  filterHideShow: any = false;
  filterMenu: any = [];
  filterCol: any = [];
  isRadioDate: boolean = false;
  dashboardDateTo: any;
  dashboardDateFrom: any = null;
  tempRange: any = {};
  objTempIndex: any = {};
  multiple: any = {};
  column: any = 0;
  tempIndex: any;
  tempInput: any = '';
  isChecked: any = false;

  // Shorting
  shortingField: any = ''; // shorting Field
  shortingDir: any = ''; // shorting Dir - ASC & DESC
  limit: number = 20;
  radioMultiple: any = 'In';

  filterRadio: any = [
    { name: 'Contains', value: 'Contains' },
    { name: 'Not Contains', value: 'Not Contains' },
    { name: 'Equals', value: 'Equals' },
    { name: 'Starts With', value: 'Starts With' },
    { name: 'Ends With', value: 'Ends With' },
    { name: '(Blank)', value: 'Blank' },
    { name: '(Not Blank)', value: 'Not Blank' },
  ];
  filterRadio2: any = [
    { name: 'Equals', value: 'Equals' },
    { name: 'Not Equals', value: 'Not Equals' },
    { name: 'Greater Than', value: 'Greater' },
    { name: 'Less Than', value: 'Less' },
    { name: 'Range (x-y)', value: 'Range' },
    { name: 'Multiple', value: '' },
    { name: '(Blank)', value: 'Blank' },
    { name: '(Not Blank)', value: 'Not Blank' },
  ];

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private downloadCSVFileService: DownloadCSVFileService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.commonService.setCurrentActiveLink('ib-transactions');
    this.commonService.pageName = 'Transactions';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.getTransactionsList();
  }

  public exportCSVFile(): void {
    if (this.transactionsList && this?.transactionsList?.rows?.length > 0) {
      this.isLoading = true;
      var ApiNameExport = API.IB_TRANSACTIONS_LIST;
      var filterData = this.filterMenu.filter(
        (item: any) => item.value != '' || item.modificator != ''
      );
      let body = {
        tableConfig: {
          filters: filterData,
          segment: {
            limit: this.limit,
            offset: 0,
          },
          sorting: {
            field: this.shortingField,
            direction: this.shortingDir,
          },
          csv: true,
          withTotals: false,
        },
      };
      this.downloadCSVFileService
        .downloadFile(ApiNameExport, body)
        .subscribe((response) => {
          if (response.status == 200 || response.ok == true) {
            let fileName = 'IB Transactions';
            let blob: Blob = response.body as Blob;
            let a: any = document.createElement('a');
            a.download = fileName;
            a.href = window.URL.createObjectURL(blob);
            a.click();
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        });
    } else {
      this.isLoading = false;
      this.toastrService.error('No data found');
    }
  }
  loadmore() {
    this.limit = this.limit + 20;
    this.applyFilter(true);
  }
  /***** TRANSACTION LIST *****/
  getTransactionsList() {
    console.log('awas reset');
    this.isLoading = true;
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
          limit: this.limit,
          offset: 0,
        },
        sorting: {
          field: this.shortingField,
          direction: this.shortingDir,
        },
        csv: false,
        withTotals: false,
      },
    };

    this.apiService
      .callApiPostRequest(API.IB_TRANSACTIONS_LIST, body)
      .subscribe(
        (res: any) => {
          if (res) {
            console.log(res);
            this.filterCol = res.columns;
            this.filterMenu = [];
            for (let index = 0; index < res.columns.length; index++) {
              const element = res.columns[index];
              if (
                index == 0 ||
                index == 1 ||
                index == 2 ||
                index == 3 ||
                index == 4 ||
                index == 5
              ) {
                this.filterMenu.push({
                  field: element.key,
                  fields: element.title,
                  modificator: '',
                  value: '',
                });
              }
            }
            this.filterMenu[3].value = [];
            this.transactionsList = res;
            this.isLoading = false;
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

  /***** HTML COLOR MANAGE *****/
  valueOFColor(val: any) {
    if (val < 0) {
      return false;
    } else {
      return true;
    }
  }

  shortingColumn: any;
  shortingHandle(item: any, type: any, index: any) {
    this.isLoading = true;
    this.shortingColumn = null;
    if (this.shortingField == item.key && this.shortingDir !== '') {
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : '';
    } else {
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : 'DESC';
    }
    this.shortingField = item.key;
    this.shortingColumn = index;
    // console.log('sorting works!');
    this.isLoading = true;
    this.applyFilter(true);
    // this.getTransactionsList();
  }

  /***** CURRENCY MANAGE  *****/
  currencyFor(val: any) {
    const value = val ? Number(val).toFixed(2) : '0.00';
    return value;
  }

  filterSearchValue(event: any, index: any) {
    this.filterMenu[index].value = event.target.value;
    this.column = index;
  }

  filterInputValue(item: any, index: any) {
    if (item === 'multiple') {
      this.filterMenu[index].value = this.multiple[this.column];
      this.filterMenu[index].modificator = this.radioMultiple;
    } else {
      this.tempIndex = item == 'Range' ? 5 : item == '' && 6;
      this.objTempIndex[this.column] = this.tempIndex;

      const currentModificator = this.filterMenu[index].modificator;
      console.log(currentModificator, index, item);

      // If the clicked radio button is already selected, unselect it
      if (currentModificator === item) {
        // this.filterMenu[index].modificator = null;
      } else {
        // Otherwise, select the clicked radio button
        this.filterMenu[index].modificator = item;
      }

      if (item === null) {
        let dateTo = '';
        if (this.dashboardDateTo) {
          dateTo = this.dashboardDateTo
            ? this.dashboardDateTo
            : ', ' + this.dashboardDateTo;
        }
        this.filterMenu[index].value = this.dashboardDateFrom
          ? this.dashboardDateFrom + ', ' + dateTo
          : '';
      }
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
    // this.isLoading = true;
    for (let index = 0; index < this.filterCol.length; index++) {
      const element = this.filterCol[index];
      this.filterMenu.push({
        field: element.key,
        fields: element.title,
        modificator: '',
        value: '',
      });
    }
    this.temp = 0;
    this.options.forEach((option) => {
      option.checked = false;
    });
    this.isLoading = false;
    this.filterHideShow = false;
    this.multiple = {};
    this.shortingDir = '';
    this.applyFilter(false);
  }
  applyFilter(isFilter: boolean) {
    console.log(this.tempIndex, 'tempIndex');
    if (this.tempIndex == 3) {
      this.filterMenu[this.tempIndex].value = [];
      this.options.forEach((option) => {
        if (option.checked == true) {
          this.filterMenu[this.tempIndex].value.push(option.value);
        }
      });
      this.filterMenu[this.tempIndex].modificator = this.radioMultiple;
    }
    console.log(this.filterMenu);
    var filterData = this.filterMenu.filter(
      (item: any) => item.value != '' || item.modificator != ''
    );

    let body = {
      tableConfig: {
        filters: filterData,
        segment: {
          limit: this.limit,
          offset: 0,
        },
        sorting: {
          field: this.shortingField,
          direction: this.shortingDir,
        },
        csv: false,
        withTotals: false,
      },
    };

    // this.isLoading = true;
    this.apiService
      .callApiPostRequest(API.IB_TRANSACTIONS_LIST, body)
      .subscribe(
        (res: any) => {
          if (res) {
            this.filterCol = res.columns;
            this.transactionsList = res;
            this.isLoading = false;
            // this.commissionreceivedTotal =
            //   res.totals?.col_columndefinitions_commissionreceived_df4259fbe749ca79c4bc07a6fe8c6cc9;
            // this.monetaryTotal =
            //   res.totals?.col_columndefinitions_commission_6c42ff19dd1b5497de5c4432bf8f9787;
            // this.lotsTotal =
            //   res.totals?.col_columndefinitions_lots_367792789d621eaeae4b47a6993921c4;
          }
        },
        (err: any) => {
          this.isLoading = false;
          this.toastrService.error(
            err.error.message ? err.error.message : 'something went wrong'
          );
        }
      );

    console.log(filterData, 'aa', this.filterMenu, 'bb');
    this.filterHideShow = false;
  }

  closeFilter() {
    this.filterHideShow = !this.filterHideShow;
  }

  normalRadioButton(index: number) {
    const otherRadioButtonIndex = [0, 4];
    if (otherRadioButtonIndex.includes(index) === false) {
      return true;
    } else {
      return false;
    }
  }

  checkAccordionDate(index: any) {
    const dateIndex: any = [2];
    if (dateIndex.includes(index)) {
      this.isRadioDate = true;
      return true;
    } else {
      this.isRadioDate = false;
      return false;
    }
  }

  maxDate() {
    const maxDate: any = new Date();
    return maxDate;
  }

  dateRangePiker(val: any, title: any, index: any) {
    console.log('val', val);
    if (title == 'from') {
      this.dashboardDateFrom = moment(val).format('YYYY-MM-DD');
    } else if (title == 'to') {
      this.dashboardDateTo = moment(val).format('YYYY-MM-DD');
    }

    this.filterInputValue(null, index);
  }

  setRadioMultiple(value: string) {
    this.radioMultiple = value;

    if (value == 'Not In') this.temp = 1;
    if (value == 'In') this.temp = 0;
  }

  caseStatus(index: any) {
    if (index === 3) {
      return true;
    } else {
      return false;
    }
  }

  selectAll: boolean = false;
  options = [
    { label: 'Approved', checked: false, value: 'approved' },
    { label: 'Declined', checked: false, value: 'declined' },
    { label: '(Blank)', checked: false, value: '(Blank)' },
    { label: '(Not Blank)', checked: false, value: '(Not Blank)' },
  ];

  toggleAllCheckboxes(index: any) {
    this.selectAll = !this.selectAll;
    this.options.forEach((option) => {
      option.checked = this.selectAll;
    });
    this.tempIndex = index;
  }

  checkSelectAll(item: any, index: any) {
    console.log(item, 'item');
    this.options = this.options.map((el, indexOptions) => {
      if (el.value == item) {
        console.log(indexOptions, 'semangat');
        el.checked = !el.checked;
      }
      return el;
    });
    // this.filterMenu[index].searchType = this.radioMultiple;
    console.log(this.tempIndex, 'semangat');
    this.tempIndex = index;
  }

  rangePiker(val: any, title: any, index: any) {
    if (title == 'to') {
      if (!Array.isArray(this.tempRange[this.column]))
        this.tempRange[this.column] = [];
      this.tempRange[this.column][1] = +val.target.value;
    }
    if (title == 'from') {
      if (!Array.isArray(this.tempRange[this.column]))
        this.tempRange[this.column] = [];
      this.tempRange[this.column][0] = +val.target.value;
    }

    console.log(this.tempRange[this.column]);
    if (this.tempRange[this.column].length > 0) {
      console.log('haha');

      console.log(this.filterMenu[index], index);
      this.filterMenu[index].value =
        this.tempRange[this.column].length > 1
          ? this.tempRange[this.column][0].toFixed(1) +
            '-' +
            this.tempRange[this.column][1].toFixed(1)
          : this.tempRange[this.column][0].toFixed(1) + '-';
    }
  }

  caseRange() {
    if (this.objTempIndex[this.column] === 5) {
      return false;
    } else {
      return true;
    }
  }

  caseMultiple() {
    if (this.objTempIndex[this.column] === 6) {
      return false;
    } else {
      return true;
    }
  }

  setColumn(index: any) {
    this.column = index;
  }

  temp: any = 0;
  first: boolean = true;
  checkIn1(value: any) {
    if (this.temp == value) {
      this.temp = value;
      return true;
    } else {
      return false;
    }
  }

  checkIn2(value: any) {
    if (this.temp != value) {
      return false;
    } else {
      this.temp = value;
      return true;
    }
  }

  toggleSwitch() {
    this.isChecked = !this.isChecked;

    if (this.isChecked == true && this.multiple !== undefined) {
      this.tempInput = this.multiple[this.column]?.join(',');
    } else {
      if (!this.multiple) {
        const temp = this.multiple[this.column][0];
        if (temp === '') {
          console.log('jalan321');
          this.multiple = {};
        }
      }
      this.multiple[this.column] = this.tempInput.split(',');
      this.tempInput = '';
    }
  }

  multipleInput(item: any, index: number) {
    if (this.isChecked === true) {
      this.multiple[this.column] = this.tempInput.split(',');
    }
    this.filterInputValue('multiple', index);
  }

  onSubmitMultiple() {
    if (this.multiple[this.column] === undefined)
      this.multiple[this.column] = [];
    this.multiple[this.column].push(this.tempInput);
    this.tempInput = '';
    console.log(this.multiple);
    this.filterInputValue('multiple', this.column);
  }

  removeMultiple(index: number) {
    console.log(index);
    this.multiple[this.column].splice(index, 1);
  }
}
