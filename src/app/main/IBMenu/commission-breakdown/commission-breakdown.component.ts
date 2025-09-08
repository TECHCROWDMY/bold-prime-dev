import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DownloadCSVFileService } from 'src/app/shared/services/download-csvfile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-commission-breakdown',
  templateUrl: './commission-breakdown.component.html',
  styleUrls: ['./commission-breakdown.component.scss'],
})
export class CommissionBreakdownComponent {
  isLoading: any = false;
  filterHideShow: any = false;
  commissionList: any = [];
  filterMenu: any = [];
  filterCol: any = [];
  limit: any = 20;
  showTotals: boolean = false;
  tempIndex: any;
  firstTime: boolean = true;
  isRadioDate: boolean = false;
  dashboardDateTo: any;
  dashboardDateFrom: any;
  tempRange: any = {};
  radioMultiple: any = 'In';
  tempInput: string = '';
  isChecked: any = false;
  objTempIndex: any = {};
  multiple: any = {};
  column: any = 0;

  // Shorting
  shortingField: any = ''; // shorting Field
  shortingDir: any = ''; // shorting Dir - ASC & DESC

  commissionreceivedTotal: any = 0;
  monetaryTotal: any = 0;
  lotsTotal: any = 0;

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

  @ViewChild('headerContainer', { static: true }) headerContainer!: ElementRef;
  @ViewChild('bodyContainer', { static: true }) bodyContainer!: ElementRef;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    private downloadCSVFileService: DownloadCSVFileService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.commonService.setCurrentActiveLink('detailed-commission-breakdown');
    this.commonService.pageName = 'Detailed Commission Breakdown';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.isLoading = true;
    this.getCommissionList();
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

  loadmore() {
    this.limit = this.limit + 20;
    // this.getCommissionList();
    this.applyFilter(true);
  }

  public exportCSVFile(): void {
    if (this?.commissionList && this?.commissionList?.rows?.length > 0) {
      this.isLoading = true;
      var ApiNameExport = API.COMMISSION_LIST;
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
            let fileName = 'Commission Breakdown';
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

  private serializeBody(body: any): string {
    let urlSearchParams = new URLSearchParams();
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        urlSearchParams.set(key, body[key]);
      }
    }
    return urlSearchParams.toString();
  }

  /***** TRANSACTION LIST   *****/
  getCommissionList() {
    // this.applyFilter(true);
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
        withTotals: true,
      },
    };

    this.apiService.callApiPostRequest(API.COMMISSION_LIST, body).subscribe(
      (res: any) => {
        if (res) {
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

          this.commissionreceivedTotal =
            +res.totals
              ?.col_columndefinitions_commissionreceived_df4259fbe749ca79c4bc07a6fe8c6cc9;
          this.monetaryTotal =
            +res.totals
              ?.col_columndefinitions_commission_6c42ff19dd1b5497de5c4432bf8f9787;
          this.lotsTotal =
            +res.totals
              ?.col_columndefinitions_lots_367792789d621eaeae4b47a6993921c4;
          this.commissionList = res;

          // res.rows.forEach((element: any) => {
          //   console.log(element.data);
          //   this.commissionreceivedTotal += +element.data[10].value;
          //   this.monetaryTotal += +element.data[9].value;
          //   this.lotsTotal += +element.data[2].value;
          // });

          // let bodyTotals: object = {
          //   tableConfig: {
          //     filters: [],
          //     segment: {
          //       limit: '5',
          //       offset: 0,
          //     },
          //     csv: false,
          //     withTotals: true,
          //   },
          // };
          this.isLoading = false;
          // this.apiService
          //   .callApiPostRequest2(API.GET_TOTALS_COMMISSION, bodyTotals)
          //   .subscribe((res2: any) => {
          //     if (res2) {
          //       console.log(res2, 'semangat1');
          //     }
          //     this.isLoading = false;
          //   });
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

  shortingColumn: any;
  /***** SHORTING   *****/
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
    // if (this.shortingDir === 'ASC') {
    //   this.reportsList.rows.sort((a: any, b: any) => {
    //     if (
    //       this.shortingColumn === 1 ||
    //       this.shortingColumn === 9 ||
    //       this.shortingColumn === 2
    //     ) {
    //       return (
    //         a.data[this.shortingColumn].value -
    //         b.data[this.shortingColumn].value
    //       );
    //     }
    //     if (this.shortingColumn === 5) {
    //       const dateFirst = new Date(a.data[this.shortingColumn].value);
    //       const dateSecond = new Date(b.data[this.shortingColumn].value);
    //       return dateFirst.getTime() - dateSecond.getTime();
    //     }
    //     console.log(b.data[this.shortingColumn].value);
    //     return a.data[this.shortingColumn].value.localeCompare(
    //       b.data[this.shortingColumn].value
    //     );
    //   });
    // }
    this.applyFilter(true);
  }

  currencyHandle(val: any, index: any) {
    let finalValue;
    if (index == 2) {
      finalValue = Number(val).toFixed(2);
    } else if (index == 9 || index == 10) {
      finalValue = Number(val).toFixed(2) + ' ' + ' USD';
    } else {
      finalValue = val;
    }
    return finalValue;
  }

  /***** CURRENCY MANAGE   *****/
  currencyFor(val: any) {
    const value = val ? Number(val).toFixed(2) : '0.00';
    return value;
  }

  valueOFColor(val: any) {
    if (val < 0) {
      return false;
    } else {
      return true;
    }
  }

  filterSearchValue(event: any, index: any) {
    this.filterMenu[index].value = event.target.value;
    this.column = index;
    // console.log(event.target.value, index);
    console.log(this.objTempIndex);
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
    // this.showTotals = false;
    this.firstTime = false;
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
    this.isLoading = false;
    this.filterHideShow = false;
    this.dashboardDateFrom = null;
    this.dashboardDateTo = null;
    this.shortingDir = '';
    this.applyFilter(false);
  }

  applyFilter(isFilter: boolean) {
    // add filterMenu

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
        withTotals: true,
      },
    };

    if (true) {
      this.firstTime = false;
      this.isLoading = true;
      this.apiService.callApiPostRequest(API.COMMISSION_LIST, body).subscribe(
        (res: any) => {
          if (res) {
            this.filterCol = res.columns;
            this.commissionList = res;
            this.commissionreceivedTotal =
              res.totals?.col_columndefinitions_commissionreceived_df4259fbe749ca79c4bc07a6fe8c6cc9;
            this.monetaryTotal =
              res.totals?.col_columndefinitions_commission_6c42ff19dd1b5497de5c4432bf8f9787;
            this.lotsTotal =
              res.totals?.col_columndefinitions_lots_367792789d621eaeae4b47a6993921c4;
            console.log(res);
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

    if (isFilter === false) {
      this.filterHideShow = false;
    }

    console.log(filterData, 'first time');
  }

  closeFilter() {
    this.filterHideShow = !this.filterHideShow;
  }

  clearSearchValue(event: any, index: any) {
    this.filterMenu[index].value = null;
  }

  toggleShowTotals() {
    this.isLoading = true;
    this.applyFilter(true);
    this.isLoading = false;
    this.showTotals = true;
  }

  checkAccordionDate(index: any) {
    const dateIndex: any = [3, 10];
    if (dateIndex.includes(index)) {
      this.isRadioDate = true;
      return true;
    } else {
      this.isRadioDate = false;
      return false;
    }
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

  maxDate() {
    const maxDate: any = new Date();
    return maxDate;
  }

  normalRadioButton(index: number) {
    const otherRadioButtonIndex = [1, 8, 9];
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
      return false;
    } else {
      return true;
    }
  }

  setColumn(index: any) {
    this.column = index;
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

  setRadioMultiple(value: string) {
    this.radioMultiple = value;
    console.log(this.radioMultiple);
  }

  multipleInput(item: any, index: number) {
    if (this.isChecked === true) {
      this.multiple[this.column] = this.tempInput.split(',');
    }
    this.filterInputValue('multiple', index);
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
