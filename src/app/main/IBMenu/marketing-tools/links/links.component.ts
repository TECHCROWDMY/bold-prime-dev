import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonDeleteComponent } from 'src/app/shared/modals/common-delete/common-delete.component';
import { Subscription } from 'rxjs';
import { LinkManageComponent } from 'src/app/shared/modals/link-manage/link-manage.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent {

  linksForm!: FormGroup;
  subscription: Subscription[] = [];

  isLoading: any = false;
  isSubmitted: any = false;
  linksHideShow: any = false
  linksList: any =[];
  linksLandingList: any;
  id: any = ''
  modalRef: any;
  linksFormInfo: any = {
    accountName: '',
    landingPage: '',
  }
  activeLink:any;
  inactiveLink:any;
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
    private titleService: Title

  ) { }


  ngOnInit(): void {
    this.commonService.setCurrentActiveLink('links');
    this.commonService.pageName = 'Links';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getLinkLandingPage();
    this.setForm();
    this.getLinkList();
  }

  /***** SET FORM  *****/
  setForm() {
    this.linksForm = this.formBuilder.group({
      accountName: [
        this.linksFormInfo.accountName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      landingPage: [
        this.linksFormInfo.landingPage,
        [
          Validators.required,
        ],
      ],

    })
  }



  /***** RESET FORM *****/
  restForm() {
    this.isLoading = true;
    this.id = ''
    this.linksForm.controls['accountName'].setValue('')
    this.linksForm.controls['landingPage'].setValue('')
    this.isLoading = false;
  }

  /***** SUBMIT FORM  *****/
  onSubmitHandle() {
    this.isSubmitted = true;
    if (this.linksForm.invalid) return;
    this.isLoading = true;

    let body = {
      name: this.linksForm.controls['accountName'].value,
      optionId: this.linksForm.controls['landingPage'].value,
    }
    var apiName: any;
    if (this.id) {
      apiName = API.LINKS + `/${this.id}/edit`
    } else {
      apiName = API.LINKS_NEW
    }
    this.apiService.callApiPostRequest(apiName, body).subscribe((res: any) => {
      if (res) {
        this.toastrService.success(this.id ? 'Your Link Has Been Updated' : 'Your New Link Has Been Created');
        this.getLinkList();

        this.isSubmitted = false;
        this.restForm();
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })


  }

  get f() {
    return this.linksForm.controls;
  }

  /***** LINK LANDING MANAGE  *****/
  getLinkLandingPage() {
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.LINKS_LANDING_PAGE, {}).subscribe((res: any) => {
      if (res) {
        this.linksLandingList = res;
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  /***** LINK LIST MANAGE  *****/
  getLinkList() {
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.LINKS, {}).subscribe((res: any) => {
      if (res) {
        this.linksList = res;
        var activeLinkCount = res.filter((item:any)=> item.isActive == true)
        var inactiveLinkCount = res.filter((item:any)=> item.isActive == false)
        this.activeLink = activeLinkCount.length
        this.inactiveLink = inactiveLinkCount.length
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  /***** ACTIVE AND DEACTIVATE DATA MANAGE  *****/
  activeHideShow() {
    this.isLoading = true;
    this.linksHideShow = !this.linksHideShow
    this.isLoading = false;
  }

  /***** EDIT LINK  *****/
  editLinks(item: any) {
    this.modalRef = this.bsModalService.show(LinkManageComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
      initialState: {
        data: item,
     },
   });
   const cb = this.modalRef.content.event.subscribe((data: any) => {
    if (data.isSuccess) {
      this.getLinkList()
    }
  });

  this.subscription.push(cb);
    // this.id = item.id
    // this.linksForm.controls['accountName'].setValue(item.name)
    // this.linksForm.controls['landingPage'].setValue(item.landingPage.id)
  }

  /***** DELETE LINK MODAL OPEN *****/
  deleteLinks(item: any) {
    this.modalRef = this.bsModalService.show(CommonDeleteComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        data: {
          title: 'Delete Link',
          desc: 'Are you sure you want to delete this link?',
          apiName: API.LINKS_DELETE,
          deleteMessage: 'Link has been successfully deleted'
        },
        item: item
      },
    });

    const cb = this.modalRef.content.event.subscribe((data: any) => {
      if (data.isSuccess) {
        this.getLinkList()
      }
    });

    this.subscription.push(cb);
  }

}
