import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';

import { DownloadCSVFileService } from 'src/app/shared/services/download-csvfile.service';

import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { arrNationDefault } from 'src/app/shared/helpers/arrNation';

@Component({
  selector: 'app-accounts-commission',
  templateUrl: './accounts-commission.component.html',
  styleUrls: ['./accounts-commission.component.scss'],
})
export class AccountsCommissionComponent {
  filterHideShow: any = false;
  isLoading: any = false;
  isSubmitted: any = false;
  reportsList: any = [];
  intervalDateValue: any = '';
  intervalDateValueTo: any = '';
  intervalVal: any = '1';
  shortingField: any = '';
  filterMenu: any = [];
  filterCol: any = [];
  shortingDir: any = '';
  filterRadio: any = [
    { name: 'Contains', value: 'Contains' },
    { name: 'Not Contains', value: 'Not Contains' },
    { name: 'Equals', value: 'Equals' },
    { name: 'Not Equals', value: 'Not Equals' },
    { name: 'Multiple', value: '' },
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
  isRadioDate: boolean = false;
  tempIndex: any;
  dashboardDateTo: any;
  dashboardDateFrom: any = null;
  arrIb: any = [
    { label: 'Yes', checked: false, value: 1 },
    { label: 'No', checked: false, value: 0 },
    { label: '(Blank)', checked: false, value: 'Blank' },
    { label: '(Not Blank)', checked: false, value: 'Not Blank' },
  ];

  column: any = 0;
  objTempIndex: any = {};
  tempRange: any = {};
  multiple: any = {};
  tempInput: any = '';
  radioMultiple: any = 'In';
  temp: any = {};
  isChecked: any = false;

  // totals
  balanceTotal: any = 0;
  commissionreceivedTotal: any = 0;
  depositsTotal: any = 0;
  lotsTotal: any = 0;
  arrNation: any = arrNationDefault;

  limit: number = 20;
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private downloadCSVFileService: DownloadCSVFileService,
    private titleService: Title
  ) {}

  public exportCSVFile(): void {
    if (this.reportsList && this?.reportsList?.rows?.length > 0) {
      var date = new Date();
      var ApiNameExport = API.ACCOUNT_REPORTS_LIST;
      this.isLoading = true;
      this.intervalDateValue = this.intervalDateValue
        ? this.intervalDateValue
        : date;
      this.intervalDateValueTo = this.intervalDateValueTo
        ? this.intervalDateValueTo
        : date;

      var filterData = this.filterMenu.filter(
        (item: any) => item.value != '' || item.modificator != ''
      );
      let body = {
        from: this.intervalDateValue,
        to: this.intervalDateValueTo,
        currency: 'USD',
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
        .subscribe((response: any) => {
          if (response.status == 200 || response.ok == true) {
            this.isLoading = false;
            let fileName = 'Account Commission';
            const cookies = response.headers.getAll('Set-Cookie');
            let blob: Blob = response.body as Blob;
            let a: any = document.createElement('a');
            a.download = fileName;
            a.href = window.URL.createObjectURL(blob);
            a.click();
          } else {
            this.isLoading = false;
          }
        });
    } else {
      this.isLoading = false;
      this.toastrService.error('No data found');
    }
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('account-commission');
    this.commonService.pageName = 'Account Commission';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    const date = new Date();
    this.intervalDateValue = date;
    this.intervalDateValueTo = date;
    this.getReportData();
    this.multiple[this.column] = [];
    this.resetCheckboxes();
  }

  currencyFormate(val: any): string {
    let formattedValue: string = '';

    if (val !== null && val !== undefined) {
      // Convert to float and round to 2 decimal places
      const floatValue: number = parseFloat(val);
      formattedValue = floatValue.toFixed(2);
    }

    return formattedValue;
  }

  currencyFor(val: any) {
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val));

    return formattedValue;
  }

  filterSearchValue(event: any, index: any) {
    const search = (toSearch: any) => {
      let terms = toSearch.split(' ');
      return this.arrNation.filter((object: any) =>
        terms.every((term: any) =>
          object.label.toLowerCase().includes(term.toLowerCase())
        )
      );
    };

    const search2 = (toSearch: any) => {
      let terms = toSearch.split(' ');
      return this.arrIb.filter((object: any) =>
        terms.every((term: any) =>
          object.label.toLowerCase().includes(term.toLowerCase())
        )
      );
    };

    if (this.column !== 4 && this.column !== 6)
      this.filterMenu[index].value = event.target.value;
    this.column = index;
    if (this.caseStatus(index)) {
      if (event.target.value == '') {
        this.clearSearchValue(null, null);
      } else if (event.target.value.length > 0) {
        const searchTerm = event.target.value;
        if (this.column === 4) this.arrNation = search(searchTerm);
        if (this.column === 6) this.arrIb = search2(searchTerm);
      }
    }
  }

  private radioVal: any;

  filterInputValue(item: any, index: any) {
    if (item === 'multiple') {
      this.filterMenu[index].value = this.multiple[this.column];
      this.filterMenu[index].modificator = this.radioMultiple;
    } else {
      this.tempIndex = item == 'Range' ? 5 : item == '' && 6;
      this.objTempIndex[this.column] = this.tempIndex;

      const currentModificator = this.filterMenu[index].modificator;

      if (currentModificator === item) {
        this.filterMenu[index].modificator = null;
        this.radioVal = undefined;
      } else {
        this.filterMenu[index].modificator = item;
        this.radioVal = item;
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

  isRadioSelected(index: any, value: any) {
    return (
      this.filterMenu[index].modificator === value &&
      this.radioVal !== undefined
    );
  }

  filterRemove() {
    this.filterHideShow =
      this.filterHideShow == false ? false : !this.filterHideShow;
  }

  dateFormate(val: any) {
    const value = moment(val).format('DD/MM/YYYY');
    return value;
  }

  loadmore() {
    this.limit = this.limit + 20;
    this.applyFilter();
  }

  intervalHandle(event: any) {
    const val = event.target.value;
    this.intervalVal = val;
    // intervalDateValue

    if (val == '1') {
      const date = new Date();
      this.intervalDateValue = date;
      this.intervalDateValueTo = date;
    } else if (val == '2') {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      this.intervalDateValue = date;
      this.intervalDateValueTo = date;
    } else if (val == '3') {
      const date = new Date();
      const weekDate = new Date();
      weekDate.setDate(weekDate.getDate() - 7);
      this.intervalDateValue = weekDate;
      this.intervalDateValueTo = date;
    } else if (val == '4') {
      const date = new Date();
      const weekDate = new Date(date.getFullYear(), date.getMonth(), 1);
      this.intervalDateValue = weekDate;
      this.intervalDateValueTo = date;
    } else if (val == '5') {
      const date = new Date();
      const firstDate = new Date(
        date.getFullYear(),
        date.getMonth() - 1 + 1,
        0
      );
      const weekDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      this.intervalDateValue = weekDate;
      this.intervalDateValueTo = firstDate;
    } else if (val == '6') {
      var date = new Date();
      var firstDate = new Date(date.getFullYear(), 0, 1);
      var weekDate = new Date(date.getFullYear(), 11 + 1, 0);
      this.intervalDateValue = firstDate;
      this.intervalDateValueTo = weekDate;
    } else if (val == '7') {
      const date = new Date();
      this.intervalDateValue = date;
      this.intervalDateValueTo = date;
    }
  }

  dateRangePiker(val: any, title: any, index: any) {
    if (index !== null) {
      if (title == 'from') {
        this.dashboardDateFrom = moment(val).format('YYYY-MM-DD');
      } else if (title == 'to') {
        this.dashboardDateTo = moment(val).format('YYYY-MM-DD');
      }

      this.filterInputValue(null, index);
    } else {
      if (title == 'from') {
        this.intervalDateValue = moment(val).format('YYYY-MM-DD');
      } else if (title == 'to') {
        this.intervalDateValueTo = moment(val).format('YYYY-MM-DD');
      }
    }
  }

  filterAccReportData() {
    this.isSubmitted = true;
    if (this.intervalDateValue == '' && this.intervalDateValueTo == '') return;
    this.isSubmitted = false;
    this.shortingDir = '';
    this.shortingColumn = null;
    this.getReportData();
  }

  filterHandle() {
    this.filterHideShow = !this.filterHideShow;
  }
  resetFilter() {
    this.filterMenu = [];
    for (let index = 0; index < this.filterCol.length; index++) {
      const element = this.filterCol[index];
      this.filterMenu.push({
        field: element.key,
        fields: element.title,
        modificator: '',
        value: '',
      });
    }

    this.arrNation = arrNationDefault;
    this.isLoading = false;
    this.filterHideShow = false;
    this.multiple = {};
    this.shortingDir = '';
    this.resetCheckboxes();
    this.getReportData();
  }

  applyFilter() {
    this.isLoading = true;
    // console.log(this.filterMenu);
    const fromDate = new Date(this.intervalDateValue);
    const toDate = new Date(this.intervalDateValueTo);
    // Set time to midnight
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    // Get timezone offset in minutes and convert it to hours
    const timezoneOffsetHours = -(fromDate.getTimezoneOffset() / 60);

    // Format dates with timezone offset
    const fromTimeString = this.formatDateWithTimezoneOffset(
      fromDate,
      timezoneOffsetHours
    );
    const toTimeString = this.formatDateWithTimezoneOffset(
      toDate,
      timezoneOffsetHours
    );

    // console.log(this.finalArrNation, 555);
    // delete this.filterMenu[this.column].value;
    const allUnchecked1 = this.finalArrNation.every(
      (item: any) => item.checked === false
    );

    if (!allUnchecked1) {
      this.filterMenu[4].value = [];
      this.finalArrNation.forEach((option: any) => {
        if (option.checked == true) {
          this.filterMenu[4].value.push(option.value);
        }
      });
      this.filterMenu[4].value = this.filterMenu[4].value.join(',');
      // delete this.filterMenu[4].modificator;
      this.filterMenu[4].modificator = this.radioMultiple;
    }

    // splitter
    const allUnchecked2 = this.finalArrIb.every(
      (item: any) => item.checked === false
    );

    if (!allUnchecked2) {
      this.filterMenu[6].value = [];
      this.finalArrIb.forEach((option: any) => {
        if (option.checked == true) {
          this.filterMenu[6].value.push(option.value);
        }
      });
      this.filterMenu[6].value = this.filterMenu[6].value.join(',');
      this.filterMenu[6].modificator = this.radioMultiple;
    }

    var filterData = this.filterMenu.filter(
      (item: any) => item.value != '' || item.modificator != ''
    );
    let body = {
      from: fromTimeString,
      to: toTimeString,
      currency: 'USD',
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
        withTotals: true,
      },
    };

    this.apiService
      .callApiPostRequest(API.ACCOUNT_REPORTS_LIST, body)
      .subscribe(
        (res: any) => {
          if (res) {
            this.filterCol = res.columns;
            this.reportsList = res;
            console.log(this.reportsList);
            this.isLoading = false;
            this.balanceTotal =
              res.totals?.col_columndefinitions_balance_33fcaebf8663b0fd2456a362a128755a;
            this.commissionreceivedTotal =
              res.totals?.col_columndefinitions_commissionreceived_b4b8308a6e6dfd17b8b298aaf7a7ddfb;
            this.depositsTotal =
              res.totals?.col_columndefinitions_deposits_abdc6b856419ea4817ae85d4d7a7d7a3;
            this.lotsTotal =
              res.totals?.col_columndefinitions_lots_87b455a0f6a91c62e244e892d929339b;
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
    this.filterHideShow = false;
  }

  formatDateWithTimezoneOffset(date: Date, offsetHours: number): string {
    const localTimestamp = date.getTime() + 3600000 * offsetHours;
    const newDate = new Date(localTimestamp);
    return newDate.toISOString().slice(0, -1);
  }

  getReportData() {
    var date = new Date();
    this.intervalDateValue = this.intervalDateValue
      ? this.intervalDateValue
      : date;
    this.intervalDateValueTo = this.intervalDateValueTo
      ? this.intervalDateValueTo
      : date;
    this.isLoading = true;

    const fromDate = new Date(this.intervalDateValue);
    const toDate = new Date(this.intervalDateValueTo);

    // Set time to midnight
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    // Get timezone offset in minutes and convert it to hours
    const timezoneOffsetHours = -(fromDate.getTimezoneOffset() / 60);

    // Format dates with timezone offset
    const fromTimeString = this.formatDateWithTimezoneOffset(
      fromDate,
      timezoneOffsetHours
    );
    const toTimeString = this.formatDateWithTimezoneOffset(
      toDate,
      timezoneOffsetHours
    );

    let body = {
      from: fromTimeString,
      to: toTimeString,
      currency: 'USD',
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
        withTotals: true,
        csv: false,
      },
    };
    console.log(body);
    this.apiService
      .callApiPostRequest(API.ACCOUNT_REPORTS_LIST, body)
      .subscribe(
        (res: any) => {
          if (res) {
            this.reportsList = res;
            console.log(this.reportsList);
            this.isLoading = false;
            this.filterCol = res.columns;
            this.filterMenu = [];
            for (let index = 0; index < res.columns.length; index++) {
              const element = res.columns[index];
              this.filterMenu.push({
                field: element.key,
                fields: element.title,
                modificator: '',
                value: '',
              });
            }
          }
          this.balanceTotal =
            res.totals?.col_columndefinitions_balance_33fcaebf8663b0fd2456a362a128755a;
          this.commissionreceivedTotal =
            res.totals?.col_columndefinitions_commissionreceived_b4b8308a6e6dfd17b8b298aaf7a7ddfb;
          this.depositsTotal =
            res.totals?.col_columndefinitions_deposits_abdc6b856419ea4817ae85d4d7a7d7a3;
          this.lotsTotal =
            res.totals?.col_columndefinitions_lots_87b455a0f6a91c62e244e892d929339b;
        },
        (err: any) => {
          this.isLoading = false;
          if (err.error.message) {
            this.toastrService.error(err.error.message);
          }
        }
      );
  }

  closeFilter() {
    this.filterHideShow = !this.filterHideShow;
  }

  removeChar(val: any) {
    const noSpecialChars = val.replace(/[^a-zA-Z0-9 ]/g, '');
    return noSpecialChars;
  }

  normalRadioButton(index: number) {
    const otherRadioButtonIndex = [1, 2, 4, 5, 6, 8, 9];
    if (otherRadioButtonIndex.includes(index) === false) {
      return true;
    } else {
      return false;
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
      return true;
    } else {
      return false;
    }
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

  onSubmitMultiple() {
    if (this.multiple[this.column] === undefined)
      this.multiple[this.column] = [];
    this.multiple[this.column].push(this.tempInput);
    this.tempInput = '';
    this.filterInputValue('multiple', this.column);
  }

  setRadioMultiple(value: string) {
    this.radioMultiple = value;

    if (value == 'Not In') this.temp[this.column] = 1;
    if (value == 'In') this.temp[this.column] = 0;
  }

  toggleSwitch() {
    this.isChecked = !this.isChecked;

    if (this.isChecked == true && this.multiple !== undefined) {
      if (
        Array.isArray(this.multiple[this.column]) &&
        this.multiple[this.column].length > 0
      ) {
        this.tempInput = this.multiple[this.column].join(',');
      }
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

  checkAccordionDate(index: any) {
    const dateIndex: any = [5];
    if (dateIndex.includes(index)) {
      // console.log(index);
      this.isRadioDate = true;
      return true;
    } else {
      this.isRadioDate = false;
      return false;
    }
  }

  caseCountry(index: any) {
    if (index === 5) {
      return true;
    } else {
      return false;
    }
  }

  setColumn(index: any) {
    this.column = index;
  }

  maxDate() {
    const maxDate: any = new Date();
    return maxDate;
  }

  caseStatus(index: any) {
    if (index === 4 || index === 6) {
      return true;
    } else {
      return false;
    }
  }

  checkIn1(value: any) {
    if (this.temp[this.column] === value) {
      this.temp[this.column] = value;
      return true;
    } else {
      return false;
    }
  }

  checkIn2(value: any) {
    if (this.temp[this.column] != value) {
      return false;
    } else {
      this.temp[this.column] = value;
      return true;
    }
  }

  selectAll: boolean = false;

  toggleAllCheckboxes(index: any) {
    this.selectAll = !this.selectAll;
    if (index === 4) {
      this.arrNation.forEach((option: any) => {
        option.checked = this.selectAll;
      });
    }

    if (index === 6) {
      this.arrIb.forEach((option: any) => {
        option.checked = this.selectAll;
      });
    }
    this.tempIndex = index;
    console.log(this.column);
  }

  finalArrNation: any = arrNationDefault;
  finalArrIb: any = this.arrIb;
  checkSelectAll(item: any, index: any) {
    console.log(item, 'item');
    if (index === 4) {
      const temp = this.arrNation.map((el: any, indexOptions: any) => {
        if (el.value == item) {
          console.log(indexOptions, 'semangat');
          el.checked = !el.checked;
        }
        return el;
      });
      // this.filterMenu[index].searchType = this.radioMultiple;

      this.finalArrNation = this.finalArrNation.map((el: any) => {
        return el.label === temp[0].label ? temp[0] : el;
      });
      console.log(temp[0], this.finalArrNation, 'semangat lagi');
    }

    if (index === 6) {
      const temp = this.arrIb.map((el: any, indexOptions: any) => {
        if (el.value == item) {
          console.log(indexOptions, 'semangat');
          el.checked = !el.checked;
        }
        return el;
      });
      // this.filterMenu[index].searchType = this.radioMultiple;

      this.finalArrIb = this.finalArrIb.map((el: any) => {
        return el.label === temp[0].label ? temp[0] : el;
      });
      console.log(temp[0], this.finalArrIb, 'semangat lagi');
    }

    this.tempIndex = index;
  }

  clearSearchValue(event: any, index: any) {
    this.arrNation = this.finalArrNation;
    console.log(this.arrNation);
  }

  removeMultiple(index: number) {
    console.log(index);
    this.multiple[this.column].splice(index, 1);
  }

  shortingColumn: any;
  shortingHandle(item: any, type: any, index: any) {
    this.isLoading = true;
    this.shortingColumn = null;
    if (this.shortingField == item.key && this.shortingDir !== '') {
      console.log(this.shortingDir, 5555);
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : '';
    } else {
      console.log(this.shortingDir, 7777);
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : 'DESC';
    }
    this.shortingField = item.key;
    this.shortingColumn = index;
    console.log(this.reportsList);
    if (this.shortingDir === 'ASC') {
      this.reportsList.rows.sort((a: any, b: any) => {
        if (
          this.shortingColumn === 1 ||
          this.shortingColumn === 9 ||
          this.shortingColumn === 2
        ) {
          return (
            a.data[this.shortingColumn].value -
            b.data[this.shortingColumn].value
          );
        }
        if (this.shortingColumn === 5) {
          const dateFirst = new Date(a.data[this.shortingColumn].value);
          const dateSecond = new Date(b.data[this.shortingColumn].value);
          return dateFirst.getTime() - dateSecond.getTime();
        }
        console.log(b.data[this.shortingColumn].value);
        return a.data[this.shortingColumn].value.localeCompare(
          b.data[this.shortingColumn].value
        );
      });
    }

    if (this.shortingDir === 'DESC') {
      this.reportsList.rows.sort((a: any, b: any) => {
        if (
          this.shortingColumn === 1 ||
          this.shortingColumn === 9 ||
          this.shortingColumn === 2
        ) {
          return (
            b.data[this.shortingColumn].value -
            a.data[this.shortingColumn].value
          );
        }
        if (this.shortingColumn === 5) {
          const dateFirst = new Date(a.data[this.shortingColumn].value);
          const dateSecond = new Date(b.data[this.shortingColumn].value);
          return dateSecond.getTime() - dateFirst.getTime();
        }
        console.log(b.data[this.shortingColumn].value);
        return b.data[this.shortingColumn].value.localeCompare(
          a.data[this.shortingColumn].value
        );
      });
    }

    // if (this.shortingDir === 'ASC' && this.shortingColumn == 7) {
    //   console.log('jalan');
    //   this.reportsList.rows.
    // }

    // this.applyFilter();
    this.isLoading = false;
  }

  resetCheckboxes() {
    this.arrNation = this.arrNation.map((obj: any) => {
      if (obj.checked === true) {
        return { ...obj, checked: !obj.checked };
      }
      return obj;
    });
    this.finalArrNation = this.finalArrNation.map((obj: any) => {
      if (obj.checked === true) {
        return { ...obj, checked: !obj.checked };
      }
      return obj;
    });

    this.arrIb = this.arrIb.map((obj: any) => {
      if (obj.checked === true) {
        return { ...obj, checked: !obj.checked };
      }
      return obj;
    });
    this.finalArrIb = this.finalArrIb.map((obj: any) => {
      if (obj.checked === true) {
        return { ...obj, checked: !obj.checked };
      }
      return obj;
    });
  }
}
