import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CancelWithdrawalComponent } from 'src/app/shared/modals/cancel-withdrawal/cancel-withdrawal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-transactions-history-funds',
  templateUrl: './transactions-history-funds.component.html',
  styleUrls: ['./transactions-history-funds.component.scss'],
})
export class TransactionsHistoryFundsComponent {
  dashboardOpenTimeFrom: any = null;
  dashboardOpenTimeTo: any = null;
  dashboardTrfTimeFrom: any = null;
  dashboardTrfTimeTo: any = null;

  normalRadioButton(index: number) {

    if (this.category == 'transactions'){
      const otherRadioButtonIndex = [0, 3, 4, 6, 7, 8];
      return !otherRadioButtonIndex.includes(index);
    }
    else {
      const otherRadioButtonIndex = [0,1,2, 5, 6];
      return !otherRadioButtonIndex.includes(index);
    }

  }

  maxDate() {
    const maxDate: any = new Date();
    return maxDate;
  }

  dateRangePiker(event: any, title: string, index: number) {
    if (index === 5) {
      // OpenTime column
      if (title === 'from') {
        this.dashboardOpenTimeFrom = event;
      } else if (title === 'to') {
        this.dashboardOpenTimeTo = event;
      }
    } else if (index === 4) {
      // CloseTime column
      if (title === 'from') {
        this.dashboardTrfTimeFrom = event;
      } else if (title === 'to') {
        this.dashboardTrfTimeTo = event;
      }
    }
    this.filterInputValue(null, index);
  }

  selectAll: boolean = false;

  toggleAllCheckboxes(index: any) {
    this.selectAll = !this.selectAll;

    if (index === 2) {
      this.arrType.forEach((option: any) => {
        option.checked = this.selectAll;
      });
    }

    if (index === 1) {
      this.arrType2.forEach((option: any) => {
        option.checked = this.selectAll;
      });
    }
    this.tempIndex = index;
  }

  caseType(index: number) {
    if (this.category == 'transactions'){
      const typeIndex: any = [1,2,5];

      if (typeIndex.includes(index)) {

          return true;
      } else {
        return false;
      }
    }
    else {
      const typeIndex: any = [3,4];

      if (typeIndex.includes(index)) {

        return true;
      } else {
        return false;
      }
    }

  }
  // Loader , Subscription and modal
  modalRef: any;
  isLoading: any = false;
  subscription: Subscription[] = [];
tempIndex: any;
column: any = '';
radioMultiple: any = 'In';
radioMultipleType: any = 'In';
  //category Manage with pandding data
  category: any = 'transactions'; // transactions & Transfer
  pendingcategory: any = 'pendingtransactions'; // pending transactions & Transfer

  // Filter Manage  (Transaction & Transfer)
  filterMenu: any = []; // Using For Filter Manage
  filterCol: any = []; // Using For Filter Manage
  filterHideShow: any = false; // Show Hide Filter
  limit: any = 50;

  // Table Data
  pandingTransactionList: any = []; // Panding Transaction table Data
  TransactionList: any = []; // TransactionList table Data
  TransferList: any = []; // Transfer table Data

  // Shorting
  shortingField: any = ''; // shorting Field
  shortingDir: any = ''; // shorting Dir - ASC & DESC

  // Custom Filter Data
  filterRadio: any = [
    { name: 'Contains', value: 'Contains' },
    { name: 'Not Contains', value: 'Not Contains' },
    { name: 'Equals', value: 'Equals' },
    { name: 'Starts With', value: 'Starts With' },
    { name: 'Ends With', value: 'Ends With' },
    { name: '(Blank)', value: '(Blank)' },
    { name: '(Not Blank)', value: '(Not Blank)' },
  ];

  arrType: any = [
    { label: 'approved', checked: false, value: 'approved' },
    { label: 'declined', checked: false, value: 'declined' },
    { label: 'cancelled', checked: false, value: 'cancelled' },
    { label: '(Blank)', checked: false, value: '(Blank)' },
    { label: '(Not Blank)', checked: false, value: '(Not Blank)' },
  ];

  arrType2: any = [
    { label: 'Balance Correction', checked: false, value: 'Balance correction' },
    { label: 'Bonus Conversion', checked: false, value: 'bonus conversion' },
    { label: 'Bonus In', checked: false, value: 'bonus in' },
    { label: 'Bonus Negative Balance', checked: false, value: 'bonus negative balance' },
    { label: 'Bonus Negative Credit Removal', checked: false, value: 'bonus negative credit removal' },
    { label: 'Bonus Out', checked: false, value: 'bonus out' },
    { label: 'Cashback Transfer In', checked: false, value: 'cashback transfer to account' },
    { label: 'Credit Expired', checked: false, value: 'credit expired' },
    { label: 'Deposit', checked: false, value: 'deposit' },
    { label: 'Dormant Fee', checked: false, value: 'dormant fee' },
    { label: 'Gas FE', checked: false, value: 'gas fe' },
    { label: 'IB Transfer In', checked: false, value: 'ib transfer in' },
    { label: 'IB Transfer Out', checked: false, value: 'ib transfer out' },
    { label: 'PAMM Fee IB Commission', checked: false, value: 'pamm fee ib commission' },
    { label: 'PAMM Immediate Execution Fee', checked: false, value: 'pamm immediate execution fee' },
    { label: 'Telegram 50 USD Bonus', checked: false, value: 'telegram 50 USD Bonus' },
    { label: 'Third Party Transfer In', checked: false, value: 'third party transfer in' },
    { label: 'Third Party Transfer Out', checked: false, value: 'third party transfer out' },
    { label: 'USDT IRC 20 fee', checked: false, value: 'usdt irc 20 fee' },
    { label: 'USDT TRC 20 fee', checked: false, value: 'usdt trc 20 fee' },
    { label: 'Withdrawal', checked: false, value: 'withdrawal' },
    { label: 'Cashback Withdrawal', checked: false, value: 'cashback withdrawal' },
    { label: 'cpa payment', checked: false, value: 'cpa payment' },
    { label: 'cpi payment', checked: false, value: 'cpi payment' },
    { label: 'cpl payment', checked: false, value: 'cpl payment' },
    { label: 'credit', checked: false, value: 'credit' },
    { label: 'IB Correction', checked: false, value: 'ib correction' },
    { label: 'IB Withdrawal', checked: false, value: 'ib withdrawal' },
    { label: 'pl', checked: false, value: 'pl' },
    { label: 'pool distribution', checked: false, value: 'pool distribution' },
    { label: 'psp fee', checked: false, value: 'psp fee' },
    { label: 'Transfer In', checked: false, value: 'transfer in' },
    { label: 'Transfer Out', checked: false, value: 'transfer out' },
    { label: 'Withdrawal Cancel', checked: false, value: 'withdrawal Cancel' },
    { label: 'Withdrawal decline', checked: false, value: 'withdrawal decline' },
    { label: '(Blank)', checked: false, value: '(Blank)' },
    { label: '(Not Blank)', checked: false, value: '(Not Blank)' },
  ];
  finalArrType: any = this.arrType;
  finalArrType2: any = this.arrType2;

  isPendingCheck: any;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}


  ngOnInit() {
    var getDepositStatusDataA = this.apiService.getDepositStatus();
    if (getDepositStatusDataA == 'success') {
      this.toastrService.success('Deposit Successfully');
    } else if (getDepositStatusDataA == 'failed') {
      this.toastrService.error('Deposit Failed');
    }
    this.apiService.clearDepositStatus();
    this.commonService.setCurrentActiveLink('transactions-history');
    this.commonService.pageName = 'Transactions History';
    this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
    this.isLoading = true;
    this.getTransactionList();
    this.getPandingTransactionList();
  }

  setRadioMultiple(value: string) {
    this.radioMultiple = value;
  }

  setRadioMultipleType(value: string) {
    this.radioMultipleType = value;
  }

  checkSelectAll(item: any, index: any) {
    console.log(item, 'item');

    if (index === 2) {
      const temp = this.arrType.map((el: any, indexOptions: any) => {
        if (el.value == item) {
          el.checked = !el.checked;
        }
        return el;
      });
      // this.filterMenu[index].searchType = this.radioMultiple;

      this.finalArrType = this.finalArrType.map((el: any) => {
        return el.label === temp[0].label ? temp[0] : el;
      });
    }

     if (index === 1) {
      const temp = this.arrType2.map((el: any, indexOptions: any) => {
        if (el.value == item) {
          el.checked = !el.checked;
        }
        return el;
      });
      // this.filterMenu[index].searchType = this.radioMultiple;

      this.finalArrType2 = this.finalArrType2.map((el: any) => {
        return el.label === temp[0].label ? temp[0] : el;
      });
    }

    this.tempIndex = index;
  }

  /***** CATEGORY HANDLE   *****/
  categoryHandle(val: any) {
    console.log(val);
    console.log(this.category);
    if (val == 'transactions' && this.category != val) {
      this.category = val;
      this.resetFilter();
    } else if (val == 'pendingtransactions' && this.pendingcategory != val) {
      this.pendingcategory = val;
    } else if (val == 'pendingtransfers' && this.pendingcategory != val) {
      this.pendingcategory = val;
      this.resetFilter();
    } else if (val == 'transfers' && this.category != val) {
      this.category = val;
      this.resetFilter();
    }
    // reset filtercol
  }

  /***** SHORTING   *****/
  shortingHandle(item: any, type: any) {
    console.log(item);
    if (this.shortingField == item.key) {
      this.shortingDir = this.shortingDir == 'DESC' ? 'ASC' : 'DESC';
    } else {
      this.shortingDir = 'ASC';
    }
    this.shortingField = item.key ? item.key : '';
    if (type == 'transaction') {
      this.limit = 50;
      this.getTransactionList();
    } else if (type == 'transfer') {
      this.limit = 50;
      this.getTransferList();
    } else if (type == 'pendingtransaction') {
      this.getPandingTransactionList();
    }
  }

  /***** FILTER MANAGE   *****/

  filterSearchValue(event: any, index: any) {
    this.filterMenu[index].value = event.target.value;
  }

  originalArrType2: { label: string; checked: boolean; value: string }[] = [...this.arrType2];
  foriginalArrType2: { label: string; checked: boolean; value: string }[] = [...this.arrType2];
  filterSearchValueType(event: any, index: any) {
    const searchValue = event.target.value.toLowerCase();

    // Reset to original array if the input is empty
    if (!searchValue) {
      this.arrType2 = this.foriginalArrType2 != this.originalArrType2 ? this.foriginalArrType2 : [...this.originalArrType2];
      this.originalArrType2 = this.foriginalArrType2;
    } else {
      // Filter dynamically with explicit typing
       this.originalArrType2 = this.arrType2.filter((item: { label: string; checked: boolean; value: string }) =>
        item.label.toLowerCase().includes(searchValue)
      );
    }
  }

  originalArrType: { label: string; checked: boolean; value: string }[] = [...this.arrType];
  foriginalArrType: { label: string; checked: boolean; value: string }[] = [...this.arrType];
  filterSearchValueStatus(event: any, index: any) {
    const searchValue = event.target.value.toLowerCase();

    // Reset to original array if the input is empty
    if (!searchValue) {
      this.arrType = this.foriginalArrType != this.originalArrType ? this.foriginalArrType : [...this.originalArrType];
      this.originalArrType = this.foriginalArrType;
    } else {
      // Filter dynamically with explicit typing
       this.originalArrType = this.arrType.filter((item: { label: string; checked: boolean; value: string }) =>
        item.label.toLowerCase().includes(searchValue)
      );
    }
  }

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
    this.finalArrType2 = this.finalArrType2.map((item: any) => {
      item.checked = false;
      return item;
    });
    this.dashboardOpenTimeFrom = null;
    this.dashboardOpenTimeTo = null;
    this.dashboardTrfTimeTo = null;
    this.dashboardTrfTimeFrom = null;
    this.applyFilter(true);
    this.originalArrType2 = [...this.arrType2];
    // if (this.pendingcategory === 'pendingtransfers') {
    //   this.getTransferList();
    // }
    // if (this.category == 'transactions') {
    //   this.getTransactionList();
    // } else if (this.category == 'transfers') {
    //   this.getTransferList();
    // }
    //
    // this.filterHideShow = false;
  }

  applyFilter(isMoveTab: boolean) {
    this.isLoading = true;

    const allUnchecked2 = this.finalArrType.every(
      (item: any) => item.checked === false
    );

    const allUnchecked3 = this.finalArrType2.every(
      (item: any) => item.checked === false
    );

    if (!allUnchecked2) {
          console.log(this.filterMenu);
      this.filterMenu[2].value = [];
      this.finalArrType.forEach((option: any) => {
        if (option.checked == true) {
          this.filterMenu[2].value.push(option.value);
        }
      });
      this.filterMenu[2].value = this.filterMenu[2].value.join(',');
      this.filterMenu[2].modificator = this.radioMultiple;
    }
    else{
       this.filterMenu[2].value = '';
      this.filterMenu[2].modificator = this.radioMultipleType;
    }

    if (!allUnchecked3) {

      this.filterMenu[1].value = [];
      this.finalArrType2.forEach((option: any) => {
        if (option.checked == true) {
          this.filterMenu[1].value.push(option.value);
        }
      });
      this.filterMenu[1].value = this.filterMenu[1].value.join(',');
      this.filterMenu[1].modificator = this.radioMultipleType;
    }
    else{
       this.filterMenu[1].value = '';
      this.filterMenu[1].modificator = this.radioMultipleType;
    }

    if (this.dashboardOpenTimeFrom) {
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      this.filterMenu[5].value = formatDate(new Date(this.dashboardOpenTimeFrom)) + ',' + formatDate(new Date(this.dashboardOpenTimeTo));
      this.filterMenu[5].modificator = 'In'; //this.radioMultipleType;
    }

    if (this.dashboardTrfTimeFrom) {
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      this.filterMenu[4].value = formatDate(new Date(this.dashboardTrfTimeFrom)) + ',' + formatDate(new Date(this.dashboardTrfTimeTo));
      this.filterMenu[4].modificator = 'In'; //this.radioMultipleType;
    }
    // console.log(this.filterMenu);
    var filterData = this.filterMenu.filter(
      (item: any) => item.value != ''
    );
    filterData = filterData.filter(
      (item: any) =>   item.modificator != ''
    );
    filterData = filterData.filter(
      (item: any) =>  item.modificator != null
    );
    let body = {
      tableConfig: {
        filters: filterData,
        segment: {
          limit: this.limit,
          offset: 0,
        },
        sorting: {
          field: '',
          direction: 'DESC',
        },
        csv: false,
        withTotals: false,
      },
    };
    var ApiName: any;
    if (this.category == 'transactions') {
      ApiName = API.TRANSACTIONS_LIST;
    } else if (this.category == 'transfers') {
      ApiName = API.TRANSFER_LIST;
    }
    this.apiService.callApiPostRequest(ApiName, body).subscribe(
      (res: any) => {
        if (res) {
          this.filterCol = res.columns;
          if (isMoveTab) {
            this.filterMenu = [];
            for (let index = 0; index < res.columns.length; index++) {
              if (index != 6 && index != 9 && index != 10) {
                const element = res.columns[index];
                this.filterMenu.push({
                  field: element.key,
                  fields: element.title,
                  modificator: '',
                  value: '',
                });
              }
            }
          }
          if (this.category == 'transactions') {

            this.TransactionList = res;
          } else if (this.category == 'transfers') {
            this.TransferList = res;
            console.log(res);
          }
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
    this.originalArrType2 = [...this.arrType2];
  }

  /***** START PENDING TRANSACTION  *****/
  /***** PENDING TRANSACTION LIST   *****/
  getPandingTransactionList() {
    let body = {
      tableConfig: {
        filters: [
          {
            field:
              'col_columndefinitions_typecolumndefinition_9c7e77b7ef3be7070a82993434e3fced',
            fields: 'Type',
            modificator: 'Contains',
            value: 'pending check',
          },
        ],
        segment: {
          limit: '',
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
    this.isLoading = true;
    this.apiService.callApiPostRequest(API.TRANSACTIONS_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          // console.log(res);
          this.isLoading = false;
          this.filterCol = res.columns;
          this.pandingTransactionList = res;
          this.pandingTransactionList.rows.forEach((item: any) => {
            this.isPendingCheck =
              (item.data[2].value == 'pending check') == true ? 1 : 0;
          });
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

  /***** CANCEL WITHDRAWAL (PENDING TRANSACTION)    *****/
  cancelWithdraw(val: any) {
    const id = val.data[0].value;
    this.modalRef = this.bsModalService.show(CancelWithdrawalComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-md',
      initialState: {
        data: {
          title: 'Withdrawal Cancel',
          desc: 'Are you sure you want to cancel this withdrawal?',
          apiName: API.TRANSACTIONS_CANCEL,
          deleteMessage: 'withdrawal has been successfully canceled',
          id: id,
        },
      },
    });

    const cb = this.modalRef.content.event.subscribe((data: any) => {
      if (data.isSuccess) {
        this.getPandingTransactionList();
        this.getTransactionList();
      }
    });

    this.subscription.push(cb);
  }

  loadmore(type: any) {
    if (type == 'transfer') {
      this.limit = this.limit + 50;
      // this.getTransferList();
    } else {
      this.limit = this.limit + 50;
      // this.getTransactionList();
    }
    this.applyFilter(false);
  }
  /***** START TRANSACTION   *****/
  /***** PAGE MANAGE   *****/
  accountDetails(val: any) {
    this.router.navigate([`app/accounts/show/${val}`]);
  }

  /***** TRANSACTION LIST   *****/
  getTransactionList() {
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
    this.isLoading = true;
    this.apiService.callApiPostRequest(API.TRANSACTIONS_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = false;
          this.filterCol = res.columns;
          this.filterMenu = [];
          for (let index = 0; index < res.columns.length; index++) {
            if (index != 6 && index != 9 && index != 10) {
              const element = res.columns[index];
              this.filterMenu.push({
                field: element.key,
                fields: element.title,
                modificator: '',
                value: '',
              });
            }
          }

          this.TransactionList = res;
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

  /***** START TRASNFER   *****/
  getTransferList() {
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
    this.isLoading = true;
    this.apiService.callApiPostRequest(API.TRANSFER_LIST, body).subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = false;
          this.filterCol = res.columns;
          this.filterMenu = [];
          console.log(res.columns);
          for (let index = 0; index < res.columns.length; index++) {
            const element = res.columns[index];
            this.filterMenu.push({
              field: element.key,
              fields: element.title,
              modificator: '',
              value: '',
            });
          }
          this.TransferList = res;
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

  /***** CURRENCY MANAGE   *****/
  currencyFor(val: any) {
    const value = val ? Number(val).toFixed(2) : '0.00';
    return value;
  }

  /***** COLOR MANAGE OF ROW DATA  *****/
  valueOFColor(val: any) {
    if (val < 0) {
      return false;
    } else {
      return true;
    }
  }

  closeFilter() {
    this.filterHideShow = !this.filterHideShow;
  }
}
