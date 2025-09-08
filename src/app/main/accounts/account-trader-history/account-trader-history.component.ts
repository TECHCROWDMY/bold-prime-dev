import { Component, ViewChild, ElementRef } from '@angular/core';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { formatIsoToCustomDate } from '../../../shared/helpers/formatIsoToCustomDate';
import { DownloadCSVFileService } from 'src/app/shared/services/download-csvfile.service';
import * as moment from 'moment';
@Component({
  selector: 'app-account-trader-history',
  templateUrl: './account-trader-history.component.html',
  styleUrls: ['./account-trader-history.component.scss'],
})
export class AccountTraderHistoryComponent {
  loginSID: any = '';
  category: any = 'live';
  isLoading: any = false;
  accountTraderList: any = [];
  filterCol: any;
  filterMenu: any = [];
  filterHideShow: any = false;
  showTotals: boolean = false;
  limit: number = 20;
  shortingField: any = ''; // shorting Field
  shortingDir: any = ''; // shorting Dir - ASC & DESC
  column: any = '';
  isRadioDate: boolean = false;
  shortingColumn: any;
  objTempIndex: any = {};
  tempRange: any = {};
  multiple: any = {};
  radioMultiple: any = 'In';
  tempIndex: any;
  tempInput: string = '';
  isChecked: any = false;
  dashboardOpenTimeFrom: any = null;
  dashboardOpenTimeTo: any = null;
  dashboardCloseTimeFrom: any = null;
  dashboardCloseTimeTo: any = null;

  lotsTotal: number = 0;
  profitsTotal: number = 0;

  filterRadio: any = [
    { name: 'Contains', value: 'Contains' },
    { name: 'Not Contains', value: 'Not Contains' },
    { name: 'Equals', value: 'Equals' },
    { name: 'Not Equals', value: 'Not Equals' },
    { name: 'Starts With', value: 'Starts With' },
    { name: 'Ends With', value: 'Ends With' },
    { name: 'Multiple', value: '' },
    { name: '(Blank)', value: '(Blank)' },
    { name: '(Not Blank)', value: '(Not Blank)' },
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
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private titleService: Title,
    private downloadCSVFileService: DownloadCSVFileService
  ) {
    this.loginSID = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.commonService.setCurrentActiveLink('accounts');
    this.commonService.pageName = 'Accounts';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.getAccTraderList();
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

  /***** CURRENCY FORMAT 1 TO 1.00   *****/
  // currencyFor(val:any){
  //   const value =  Number(val).toFixed(2)
  //    return value;
  //  }

  currencyFor(val: any): string {
    const numericValue = Number(val);

    if (!isNaN(numericValue)) {
      const formattedValue = numericValue
        .toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        .replace(/,/g, '');

      return formattedValue;
    } else {
      return '$0.00';
    }
  }

  getAccTraderList() {
    this.isLoading = true;
    let body = {
      loginSid: this.loginSID,
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
    this.apiService
      .callApiPostRequest(API.ACCOUNTS_TRADER_HISTORY, body)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            this.filterCol = res.columns;
            for (let index = 0; index < res.columns.length; index++) {
              const element = res.columns[index];
              this.filterMenu.push({
                field: element.key,
                fields: element.title,
                modificator: null,
                value: '',
              });
            }
            this.accountTraderList = res;
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

  // filterSearchValue(event: any, index: any) {
  //   this.filterMenu[index].value = event.target.value;
  //   console.log(this.filterMenu[index]);
  // }
  filterSearchValue(event: any, index: any) {
    const search2 = (toSearch: any) => {
      let terms = toSearch.split(' ');
      return this.arrType.filter((object: any) =>
        terms.every((term: any) =>
          object.label.toLowerCase().includes(term.toLowerCase())
        )
      );
    };

    if (this.column !== 2) this.filterMenu[index].value = event.target.value;
    this.column = index;
    if (this.caseType(this.column)) {
      console.log('WORKING MTFK');
      if (event.target.value == '') {
        this.clearSearchValue(null, null);
      } else if (event.target.value.length > 0) {
        const searchTerm = event.target.value;
        if (this.column === 2) this.arrType = search2(searchTerm);
      }
    }
  }

  filterInputValue(item: any, index: any) {
    if (item === 'multiple') {
      this.filterMenu[index].value = this.multiple[this.column];
      this.filterMenu[index].modificator = this.radioMultiple;
    } else {
      this.tempIndex = item == 'Range' ? 5 : item == '' && 6;
      this.objTempIndex[this.column] = this.tempIndex;

      // Handle date filters based on the column index
      if (item === null) {
        let dateFrom = '';
        let dateTo = '';

        // Function to convert Date to YYYY-MM-DD format without time zone issues
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // Check if the column corresponds to OpenTime or CloseTime and assign dates accordingly
        if (index === 4) {
          // OpenTime column
          dateFrom = this.dashboardOpenTimeFrom
            ? formatDate(new Date(this.dashboardOpenTimeFrom))
            : '';
          dateTo = this.dashboardOpenTimeTo
            ? formatDate(new Date(this.dashboardOpenTimeTo))
            : formatDate(new Date()); // Set to current date if empty
        } else if (index === 6) {
          // CloseTime column
          dateFrom = this.dashboardCloseTimeFrom
            ? formatDate(new Date(this.dashboardCloseTimeFrom))
            : '';
          dateTo = this.dashboardCloseTimeTo
            ? formatDate(new Date(this.dashboardCloseTimeTo))
            : formatDate(new Date()); // Set to current date if empty
        }

        this.filterMenu[index].value =
          dateFrom && dateTo ? `${dateFrom}, ${dateTo}` : dateFrom;
      }

      const currentModificator = this.filterMenu[index].modificator;

      if (currentModificator === item) {
        // Do nothing if the same modifier is clicked again
      } else {
        // Otherwise, select the clicked radio button
        this.filterMenu[index].modificator = item;
      }
    }
  }

  filterRemove() {
    this.filterHideShow =
      this.filterHideShow == false ? false : !this.filterHideShow;
  }

  filterHandle() {
    this.filterHideShow = !this.filterHideShow;
  }

  resetFilter() {
    this.filterMenu = [];
    this.isLoading = true;

    for (let index = 0; index < this.filterCol.length; index++) {
      const element = this.filterCol[index];

      this.filterMenu.push({
        field: element.key,
        fields: element.title,
        modificator: null,
        value: '',
      });
    }
    this.isLoading = false;
    this.filterHideShow = false;
    // this.arrType = [...this.finalArrType];
    this.finalArrType = this.finalArrType.map((item: any) => {
      item.checked = false;
      return item;
    });
    this.applyFilter();
  }

  applyFilter() {
    this.isLoading = true;
    console.log(this.tempIndex, 555);

    const allUnchecked2 = this.finalArrType.every(
      (item: any) => item.checked === false
    );

    if (!allUnchecked2) {
      this.filterMenu[2].value = [];
      this.finalArrType.forEach((option: any) => {
        if (option.checked == true) {
          this.filterMenu[2].value.push(option.value);
        }
      });
      this.filterMenu[2].value = this.filterMenu[2].value.join(',');
      this.filterMenu[2].modificator = this.radioMultiple;
    }

    var filterData = this.filterMenu.filter((item: any) => item.value != '');
    console.log(filterData, 666);

    let body = {
      loginSid: this.loginSID,
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
      .callApiPostRequest(API.ACCOUNTS_TRADER_HISTORY, body)
      .subscribe(
        (res: any) => {
          if (res) {
            this.filterCol = res.columns;
            this.accountTraderList = res;

            console.log(res, 666);
            this.lotsTotal =
              res.totals?.col_columndefinitions_lots_3d0060bc85253b9d6e3327586eadd585;
            this.profitsTotal =
              res.totals?.col_columndefinitions_profit_a6fa844d4870917d2727eb58cee49f17;
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
    this.filterHideShow = false;
  }

  closeFilter() {
    this.filterHideShow = !this.filterHideShow;
  }

  toggleShowTotals() {
    this.isLoading = true;
    this.applyFilter();
    this.showTotals = true;
  }

  setColumn(index: any) {
    this.column = index;
  }

  loadmore() {
    this.limit = this.limit + 20;
    // this.getCommissionList();
    this.applyFilter();
  }

  // unknown
  checkAccordionDate(index: any) {
    const dateIndex: any = [4, 6];
    if (dateIndex.includes(index)) {
      this.isRadioDate = true;
      return true;
    } else {
      this.isRadioDate = false;
      return false;
    }
  }

  caseType(index: number) {
    const typeIndex: any = [2];

    if (typeIndex.includes(index)) {
      return true;
    } else {
      return false;
    }
  }

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

    this.applyFilter();
  }

  normalRadioButton(index: number) {
    const otherRadioButtonIndex = [0, 3, 4, 5, 6, 7, 8, 9, 10];
    if (otherRadioButtonIndex.includes(index) === false) {
      return true;
    } else {
      return false;
    }
  }

  clearSearchValue(event: any, index: any) {
    // Restore the original array
    this.arrType = [...this.finalArrType];

    // Reset the filter value in case it was used
    if (index !== null && this.filterMenu[index]) {
      this.filterMenu[this.column].value = '';
    }
  }

  caseRange() {
    if (this.objTempIndex[this.column] === 5) {
      return false;
    } else {
      return true;
    }
  }

  removeMultiple(index: number) {
    console.log(index);
    this.multiple[this.column].splice(index, 1);
  }

  caseMultiple() {
    if (
      this.objTempIndex[this.column] === 6 ||
      this.objTempIndex[this.column] === 7
    ) {
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
    console.log(this.multiple);
    this.filterInputValue('multiple', this.column);
  }

  setRadioMultiple(value: string) {
    this.radioMultiple = value;
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

  private radioVal: any;

  isRadioSelected(index: any, value: any) {
    console.log(this.filterMenu[index].modificator, value, this.radioVal);
    return (
      this.filterMenu[index].modificator === value &&
      this.radioVal !== undefined
    );
  }

  selectAll: boolean = false;

  arrType: any = [
    { label: 'buy', checked: false, value: 'buy' },
    { label: 'sell', checked: false, value: 'sell' },
    { label: 'balance', checked: false, value: 'balance' },
    { label: 'credit', checked: false, value: 'credit' },
    { label: 'buy limit', checked: false, value: 'buy limit' },
    { label: 'sell limit', checked: false, value: 'sell limit' },
    { label: 'buy stop', checked: false, value: 'buy stop' },
    { label: 'sell stop', checked: false, value: 'sell stop' },
    { label: 'transfer in', checked: false, value: 'transfer in' },
    { label: 'transfer out', checked: false, value: 'transfer out' },
    { label: '(Blank)', checked: false, value: '(Blank)' },
    { label: '(Not Blank)', checked: false, value: '(Not Blank)' },
  ];

  finalArrType: any = this.arrType;

  toggleAllCheckboxes(index: any) {
    this.selectAll = !this.selectAll;

    if (index === 2) {
      this.arrType.forEach((option: any) => {
        option.checked = this.selectAll;
      });
    }
    this.tempIndex = index;
    console.log(this.column);
  }

  checkSelectAll(item: any, index: any) {
    console.log(item, 'item');

    if (index === 2) {
      const temp = this.arrType.map((el: any, indexOptions: any) => {
        if (el.value == item) {
          console.log(indexOptions, 'semangat');
          el.checked = !el.checked;
        }
        return el;
      });
      // this.filterMenu[index].searchType = this.radioMultiple;

      this.finalArrType = this.finalArrType.map((el: any) => {
        return el.label === temp[0].label ? temp[0] : el;
      });
      console.log(temp[0], this.finalArrType, 'semangat lagi');
    }

    this.tempIndex = index;
  }

  // Add a method to use in your template
  formatDate(dateString: string): string {
    return formatIsoToCustomDate(dateString, -4);
  }

  public exportCSVFile(): void {
    if (this.accountTraderList && this?.accountTraderList?.rows?.length > 0) {
      var ApiNameExport = API.ACCOUNTS_TRADER_HISTORY;
      this.isLoading = true;

      var filterData = this.filterMenu.filter(
        (item: any) => item.value != '' || item.modificator != ''
      );
      let body = {
        loginSid: this.loginSID,
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
            let fileName = 'Account Trader History';
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

  maxDate() {
    const maxDate: any = new Date();
    return maxDate;
  }

  dateRangePiker(event: any, title: string, index: number) {
    if (index === 4) {
      // OpenTime column
      if (title === 'from') {
        this.dashboardOpenTimeFrom = event;
      } else if (title === 'to') {
        this.dashboardOpenTimeTo = event;
      }
    } else if (index === 6) {
      // CloseTime column
      if (title === 'from') {
        this.dashboardCloseTimeFrom = event;
      } else if (title === 'to') {
        this.dashboardCloseTimeTo = event;
      }
    }
    this.filterInputValue(null, index);
  }
}
