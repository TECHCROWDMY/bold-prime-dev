import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DownloadCSVFileService } from 'src/app/shared/services/download-csvfile.service';
import { arrNationDefault } from 'src/app/shared/helpers/arrNation';

@Component({
  selector: 'app-client-commission',
  templateUrl: './client-commission.component.html',
  styleUrls: ['./client-commission.component.scss'],
})
export class ClientCommissionComponent {
  filterHideShow: any = false;
  isLoading: any = false;
  isSubmitted: any = false;
  reportsList: any = [];
  intervalDateValue: any = '';
  intervalDateValueTo: any = '';
  intervalVal: any = '1';
  shortingDir: any = '';
  shortingField: any = '';
  filterMenu: any = [];
  filterCol: any = [];
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

  // totals
  withdrawalsTotal: any = '';
  commissionreceivedTotal: any = '';
  depositsTotal: any = '';
  lotsTotal: any = '';
  limit: number = 20;
  arrNation: any = arrNationDefault;
  temp: any = 0;
  radioMultiple: any = 'In';
  isRadioDate: boolean = false;
  finalArrNation: any = arrNationDefault;
  column: any = 0;
  objTempIndex: any = {};
  tempRange: any = [0];
  multiple: any = {};
  tempInput: any = '';
  isChecked: any = false;
  selectAll: boolean = false;
  tempIndex: any;
  arrIb: any = [
    { label: 'Yes', checked: false, value: 1 },
    { label: 'No', checked: false, value: 0 },
    { label: '(Blank)', checked: false, value: '(Blank)' },
    { label: '(Not Blank)', checked: false, value: '(Not Blank)' },
  ];
  finalArrIb: any = this.arrIb;
  dashboardDateTo: any;
  dashboardDateFrom: any = null;
  filterRadio2: any = [
    { name: 'Equals', value: 'Equals' },
    { name: 'Range (x-y)', value: 'Range' },
    { name: 'Not Equals', value: 'Not Equals' },
    { name: 'Greater', value: 'Greater' },
    { name: 'Less', value: 'Less' },
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
    this.commonService.setCurrentActiveLink('client-commission');
    this.commonService.pageName = 'Client Commission';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    const date = new Date();
    this.intervalDateValue = date;
    this.intervalDateValueTo = date;
    this.resetCheckboxes();
    this.getReportData();
  }
  loadmore() {
    this.limit = this.limit + 20;
    this.applyFilter();
  }

  currencyFor(val: any) {
    const formattedValue = new Intl.NumberFormat('en-US', {
      // style: 'currency',
      // currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val));

    return formattedValue;
  }

  closeFilter() {
    this.filterHideShow = !this.filterHideShow;
  }

  public exportCSVFile(): void {
    if (this.reportsList && this?.reportsList?.rows?.length > 0) {
      var ApiNameExport = API.CLIENT_REPORTS_LIST;
      var date = new Date();
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
        .subscribe((response) => {
          if (response.status == 200 || response.ok == true) {
            let fileName = 'Client Commission';
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

  // dateRangePiker(val: any) {
  //   var reportAccDate = val
  //   this.intervalDateValue = reportAccDate[0];
  //   this.intervalDateValueTo = reportAccDate[1];
  // }

  // dateRangePiker(val: any, title: any) {
  //   if (title == 'from') {
  //     this.intervalDateValue = val;
  //   } else if (title == 'to') {
  //     this.intervalDateValueTo = val;
  //   }
  // }

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

  minDate() {
    var minDate: any = '';
    if (this.intervalDateValue != '') {
      minDate = this.intervalDateValue;
    } else {
      minDate = new Date();
    }
    return minDate;
  }

  maxDate() {
    const maxDate = new Date();
    return maxDate;
  }

  filterSearchValue(event: any, index: any) {
    console.log('ini jalan loh');
    const search = (toSearch: any) => {
      let terms = toSearch.split(' ');
      return this.arrNation.filter((object: any) =>
        terms.every((term: any) =>
          object.label.toLowerCase().includes(term.toLowerCase())
        )
      );
    };

    this.filterMenu[index].value = event.target.value;
    this.column = index;
    if (this.caseStatus(index)) {
      if (event.target.value == '') {
        this.clearSearchValue(null, null);
      } else if (event.target.value.length > 0) {
        const searchTerm = event.target.value;
        this.arrNation = search(searchTerm);
      }
    }
  }

  // filterInputValue(item: any, index: any) {
  //   this.filterMenu[index].modificator = item;
  // }

  filterInputValue(item: any, index: any) {
    if (item === 'multiple') {
      this.objTempIndex[this.column] = this.tempIndex;
      this.filterMenu[index].value = this.multiple[this.column];
      this.filterMenu[index].modificator = this.radioMultiple;
    } else {
      this.tempIndex = item == 'Range' ? 5 : item == '' && 6;
      console.log(this.tempIndex, 555);
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
    this.filterHideShow =
      this.filterHideShow == false ? false : !this.filterHideShow;
  }

  filterAccReportData() {
    this.isSubmitted = true;
    if (this.intervalDateValue == '' && this.intervalDateValueTo == '') return;
    this.isSubmitted = false;
    this.getReportData();
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

  filterHandle() {
    this.filterHideShow = !this.filterHideShow;
  }

  dateFormate(val: any) {
    const value = moment(val).format('DD/MM/YYYY');
    return value;
  }

  resetFilter() {
    this.filterMenu = [];
    this.isLoading = true;
    for (let index = 0; index < this.filterCol.length; index++) {
      const element = this.filterCol[index];
      this.filterMenu.push({
        field: element.key,
        fields: element.title,
        modificator: '',
        value: '',
      });
    }
    this.isLoading = false;
    this.filterHideShow = false;
    this.shortingDir = '';
    this.resetCheckboxes();
    this.applyFilter();
  }

  applyFilter() {
    this.isLoading = true;
    console.log(this.filterMenu);
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

    console.log(this.finalArrNation, 555);
    // delete this.filterMenu[this.column].value;
    const allUnchecked1 = this.finalArrNation.every(
      (item: any) => item.checked === false
    );

    if (!allUnchecked1) {
      this.filterMenu[1].value = [];
      this.finalArrNation.forEach((option: any) => {
        if (option.checked == true) {
          this.filterMenu[1].value.push(option.value);
        }
      });
      this.filterMenu[1].value = this.filterMenu[1].value.join(',');
      // delete this.filterMenu[1].modificator;
      this.filterMenu[1].modificator = this.radioMultiple;
    }

    // splitter
    const allUnchecked2 = this.finalArrIb.every(
      (item: any) => item.checked === false
    );

    if (!allUnchecked2) {
      this.filterMenu[3].value = [];
      this.finalArrIb.forEach((option: any) => {
        if (option.checked == true) {
          this.filterMenu[3].value.push(option.value);
        }
      });
      this.filterMenu[3].value = this.filterMenu[3].value.join(',');
      this.filterMenu[3].modificator = this.radioMultiple;
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

    this.apiService.callApiPostRequest(API.CLIENT_REPORTS_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          this.filterCol = res.columns;
          this.reportsList = res;
          this.isLoading = false;
          this.withdrawalsTotal =
            res.totals?.col_columndefinitions_withdrawals_b718b83f34859734d93971b29bc2ab6d;
          this.commissionreceivedTotal =
            res.totals?.col_columndefinitions_commissionreceived_14d253926a5f3189985c9208ae96af73;
          this.depositsTotal =
            res.totals?.col_columndefinitions_deposits_4fccfcc40e147e3328ecc28e0760b370;
          this.lotsTotal =
            res.totals?.col_columndefinitions_lots_ebf44d4ef99e87d920a913b6aa9b28fd;
        }
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

  currencyFormate(val: any): string {
    let formattedValue: string = '';

    if (val !== null && val !== undefined) {
      // Convert to float and round to 2 decimal places
      const floatValue: number = parseFloat(val);
      formattedValue = floatValue.toFixed(2);
    }

    return formattedValue;
  }

  formatDateWithTimezoneOffset(date: Date, offsetHours: number): string {
    const localTimestamp = date.getTime() + 3600000 * offsetHours;
    const newDate = new Date(localTimestamp);
    return newDate.toISOString().slice(0, -1);
  }

  getReportData() {
    this.isLoading = true;
    // var date = new Date();
    // this.intervalDateValue = this.intervalDateValue ? this.intervalDateValue : date
    // this.intervalDateValueTo = this.intervalDateValueTo ? this.intervalDateValueTo : date

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
          // field: "",
          // direction: "DESC"
          field: this.shortingField,
          direction: this.shortingDir,
        },
        csv: false,
        withTotals: true,
      },
    };
    this.apiService.callApiPostRequest(API.CLIENT_REPORTS_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          this.reportsList = res;
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

        this.withdrawalsTotal =
          res.totals?.col_columndefinitions_withdrawals_b718b83f34859734d93971b29bc2ab6d;
        this.commissionreceivedTotal =
          res.totals?.col_columndefinitions_commissionreceived_14d253926a5f3189985c9208ae96af73;
        this.depositsTotal =
          res.totals?.col_columndefinitions_deposits_4fccfcc40e147e3328ecc28e0760b370;
        this.lotsTotal =
          res.totals?.col_columndefinitions_lots_ebf44d4ef99e87d920a913b6aa9b28fd;
      },
      (err: any) => {
        this.isLoading = false;
        this.toastrService.error(
          err.error.message ? err.error.message : 'something went wrong'
        );
      }
    );
  }

  caseStatus(index: any) {
    if (index === 1 || index === 3) {
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

  setRadioMultiple(value: string) {
    this.radioMultiple = value;

    if (value == 'Not In') this.temp = 1;
    if (value == 'In') this.temp = 0;
  }

  checkAccordionDate(index: any) {
    const dateIndex: any = [2];
    if (dateIndex.includes(index)) {
      // console.log(index);
      this.isRadioDate = true;
      return true;
    } else {
      this.isRadioDate = false;
      return false;
    }
  }

  clearSearchValue(event: any, index: any) {
    this.arrNation = this.finalArrNation;
  }

  normalRadioButton(index: number) {
    const otherRadioButtonIndex = [1, 2, 3, 5, 6, 7, 8];
    if (otherRadioButtonIndex.includes(index) === false) {
      return true;
    } else {
      return false;
    }
  }

  caseMultiple() {
    if (this.objTempIndex[this.column] === 6) {
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
      this.multiple[this.column] = this.tempInput?.split(',');
      this.tempInput = '';
    }
  }

  multipleInput(item: any, index: number) {
    if (this.isChecked === true) {
      this.multiple[this.column] = this.tempInput.split(',');
    }
    this.filterInputValue('multiple', index);
  }

  toggleAllCheckboxes(index: any) {
    this.selectAll = !this.selectAll;
    if (index === 1) {
      this.arrNation.forEach((option: any) => {
        option.checked = this.selectAll;
      });
    }

    if (index === 3) {
      this.arrIb.forEach((option: any) => {
        option.checked = this.selectAll;
      });
    }
    this.tempIndex = index;
  }

  checkSelectAll(item: any, index: any) {
    if (index === 1) {
      const temp = this.arrNation.map((el: any, indexOptions: any) => {
        if (el.value == item) {
          el.checked = !el.checked;
        }
        return el;
      });
      // this.filterMenu[index].searchType = this.radioMultiple;

      this.finalArrNation = this.finalArrNation.map((el: any) => {
        return el.label === temp[0].label ? temp[0] : el;
      });
    }

    if (index === 3) {
      const temp = this.arrIb.map((el: any, indexOptions: any) => {
        if (el.value == item) {
          el.checked = !el.checked;
        }
        return el;
      });
      // this.filterMenu[index].searchType = this.radioMultiple;

      this.finalArrIb = this.finalArrIb.map((el: any) => {
        return el.label === temp[0].label ? temp[0] : el;
      });
    }
    this.tempIndex = index;
  }

  caseCountry(index: any) {
    if (index === 5) {
      return true;
    } else {
      return false;
    }
  }

  removeMultiple(index: number) {
    this.multiple.splice(index, 1);
  }

  setColumn(index: any) {
    this.column = index;
  }

  shortingColumn: any;
  shortingHandle(item: any, type: any, index: any) {
    this.isLoading = true;
    this.shortingColumn = null;
    console.log(this.shortingField.columns);
    if (this.shortingField == item.key && this.shortingDir !== '') {
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : '';
      console.log(this.shortingDir, 'apakah ini');
    } else {
      console.log(this.shortingDir, 7777);
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : 'DESC';
    }
    this.shortingField = item.key;
    this.shortingColumn = index;
    this.applyFilter();
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
