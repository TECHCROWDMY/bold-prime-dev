import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { API } from 'src/app/shared/constants/constant';
import { BannerGetCodeComponent } from 'src/app/shared/modals/banner-get-code/banner-get-code.component';
import { CommonDeleteComponent } from 'src/app/shared/modals/common-delete/common-delete.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  isLoading: any = false;
  bannerList: any = [];
  modalRef: any;
  filterCol: any = [];
  bannerListView: any = [];
  filterMenu: any = [];
  titleViewMore: any = '';
  viewMoreStatus: any = false;
  filterHideShow: any = false;
  stateParam: string = '';
  setParam: any;
  private setParamSubject = new Subject<string>();

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    public bsModalService: BsModalService,
    public cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.stateParam = params['state'] ?? '';
      this.setParam =
        this.stateParam !== '' ? 'banners:' + this.stateParam : '';
      this.setParamSubject.next(this.setParam);
    });

    this.setParamSubject.subscribe((newSetParam) => {
      console.log(newSetParam, 555);
      this.commonService.setCurrentActiveLink('banners' + newSetParam);
      this.commonService.pageName = 'Banners';
      this.titleService.setTitle('Bold Prime | ' + this.commonService.pageName);
      this.getBannerList();
      console.log('hahaha');
    });
    this.getBannerList();
  }

  getBannerList() {
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
          limit: '1000',
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
    this.apiService.callApiPostRequest(API.BANNER_LIST, body).subscribe(
      (res: any) => {
        this.bannerList = [];
        this.bannerListView = [];
        if (res) {
          this.filterCol = res.columns;
          for (let index = 0; index < res.columns.length; index++) {
            const element = res.columns[index];
            if (index != 0) {
              this.filterMenu.push({
                field: element.key,
                fields: element.title,
                modificator: 'Contains',
                value: [],
                fieldsArray: [],
              });
            }
          }
          for (let indexArray = 0; indexArray < res.rows.length; indexArray++) {
            const sizeEle = res.rows[indexArray].data[2].value;
            const languageEle = res.rows[indexArray].data[3].value;
            const campaignEle = res.rows[indexArray].data[4].value;

            for (let index = 0; index < this.filterMenu.length; index++) {
              const element = this.filterMenu[index];
              if (element.fields == 'Size') {
                this.filterMenu[index].fieldsArray.push(sizeEle);
              } else if (element.fields == 'Language') {
                this.filterMenu[index].fieldsArray.push(languageEle);
              } else if (element.fields == 'Campaign') {
                this.filterMenu[index].fieldsArray.push(campaignEle);
              }
            }
          }
          const addMenu = ['(Blank)', '(Not Blank)'];
          const combinedArray: any[] = [
            ...this.filterMenu[2].fieldsArray,
            ...addMenu,
          ];
          this.filterMenu[2].fieldsArray = combinedArray;

          for (let index = 0; index < this.filterMenu.length; index++) {
            const element = this.filterMenu[index].fieldsArray;
            this.filterMenu[index].fieldsArray = Array.from(new Set(element));
          }

          this.responseDataManage(res);
          if (this.setParam !== '') this.applyFilterParams(this.setParam);
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

  responseDataManage(res: any) {
    if (res.rows.length > 0) {
      for (let index = 0; index < res.rows.length; index++) {
        const element = res.rows[index];
        const itemId = element.data[0].value;
        const itemImage = element.data[1].value;
        const itemSize = element.data[2].value;
        const itemLanguage = element.data[3].value;
        const itemName = element.data[4].value;

        const itemKey = element.data[0].key;
        const itemImageKey = element.data[1].key;
        const itemSizeKey = element.data[2].key;
        const itemLanguageKey = element.data[3].key;
        const itemNameKey = element.data[4].key;

        this.bannerList.push({
          id: itemId,
          image: itemImage,
          size: itemSize,
          language: itemLanguage,
          title: itemName,
          idKey: itemKey,
          imageKey: itemImageKey,
          sizeKey: itemSizeKey,
          languageKey: itemLanguageKey,
          titleKey: itemNameKey,
        });
      }
    }

    this.bannerListView = this.bannerList;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  backHandle() {
    this.viewMoreStatus = false;
    this.titleViewMore = '';
  }

  viewMore(item: any) {
    this.titleViewMore = item.title;
    this.viewMoreStatus = true;
  }

  filterHandle() {
    this.filterHideShow = !this.filterHideShow;
  }

  filterInputValue(item: any, index: any) {
    console.log(item, index);
    let element = this.filterMenu[index].value;
    const indexValue = element.indexOf(item);
    if (indexValue > -1) {
      element.splice(indexValue, 1);
    } else {
      element.push(item);
    }
  }

  filterRemove() {
    this.filterHideShow = false;
    console.log(this.filterHideShow, 'this.filterHideShow ');
  }

  applyFilter() {
    this.isLoading = true;
    const filterData = this.filterMenu.filter(
      (item: any) => item.value.length > 0
    );

    console.log(filterData);
    const filterArray = [];
    for (let index = 0; index < filterData.length; index++) {
      const elementArray = filterData[index];
      const valueArray = filterData[index].value;
      for (let indexArray = 0; indexArray < valueArray.length; indexArray++) {
        const element = valueArray[indexArray];
        filterArray.push({
          field: elementArray.field,
          modificator: elementArray.modificator,
          value: element,
        });
      }
    }

    let body = {
      tableConfig: {
        filters: filterArray,
        segment: {
          limit: '1000',
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

    this.apiService.callApiPostRequest(API.BANNER_LIST, body).subscribe(
      (res: any) => {
        this.bannerList = [];
        this.bannerListView = [];
        if (res) {
          this.filterCol = res.columns;
          this.responseDataManage(res);
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

  getDataRow(val: any) {
    const baseURL = API.IMAGE_BASE_URL_BANNER;
    return `${baseURL}${val}`;
  }

  getCodes() {
    const body = {
      ApiName: `${API.BANNER_LIST}/${18}/get-code/${8791}`,
    };
    this.modalRef = this.bsModalService.show(BannerGetCodeComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        item: body,
      },
    });
  }

  resetFilters() {
    this.filterMenu = [];
    this.isLoading = true;
    this.isLoading = false;
    this.filterHideShow = false;
    this.getBannerList();
  }

  closeFilter() {
    this.filterHideShow = !this.filterHideShow;
  }

  applyFilterParams(url: string) {
    let filter: any;

    if (url === 'banners:benefits_of_mt5') {
      filter = 'Benefits of MT5';
    } else if (url === 'banners:midyear_bonus_2024') {
      filter = 'Midyear Bonus 2024';
    } else if (url === 'banners:social_trading_materials') {
      filter = 'Social Trading Materials';
      filter = '(Blank)';
    } else if (url === 'banners:unique_selling_point') {
      filter = 'Unique Selling Point';
    } else if (url === 'banners:how_to_login_to_mt4/mt5_account') {
      filter = 'How to Login to MT4/MT5 Account';
    } else if (url === 'banners:how_to_open_trading_account') {
      filter = 'How to Open Trading Account';
    } else if (url === 'banners:how_to_verify_your_account') {
      filter = 'How to Verify Your Account';
    } else if (url === 'banners:how_to_deposit_your_funds') {
      filter = 'How to Deposit Your Funds';
    } else if (url === 'banners:how_to_withdraw_your_funds') {
      filter = 'How to Withdraw Your Funds';
    }

    if (filter !== undefined) {
      this.filterInputValue(filter, 2);
      this.applyFilter();
    }
  }
}
