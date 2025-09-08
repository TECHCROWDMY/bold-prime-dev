import { Component, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { API } from '../../constants/constant';

@Component({
  selector: 'app-link-manage',
  templateUrl: './link-manage.component.html',
  styleUrls: ['./link-manage.component.scss']
})
export class LinkManageComponent {

  public event: EventEmitter<any> = new EventEmitter();
  data:any;
  linkForm!: FormGroup;
  subscription: Subscription[] = [];

  linkFormInfo: any = {
    name: '',
    optionId: '',
  };
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  linksLandingList:any ;
  constructor(
    private formBuilder: FormBuilder,
    public bsModalService: BsModalService,
    public commonService: CommonService,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getLinkLandingPage();
    this.setForm();
    this.linkForm.controls['name'].setValue(this.data.name)
    this.linkForm.controls['optionId'].setValue(this.data.landingPage.id)
  }

  cancelData(){ this.bsModalService.hide(); }



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


 /***** GET ACCOUNT TYPE FROM FORM VALUE  *****/
 getLinkDetails(){
  // this.DemoOpenLoading = true;
  // this.apiService.callApiGetRequest(API.ACCOUNTS_TYPE, {}).subscribe((res: any) => {
  //   if (res) {
  //     for (let index = 0; index < res.length; index++) {
  //       const element = res[index]
  //       console.log(element)
  //       if(element.category == this.types){
  //         this.accountTypeDemo.push(element)
  //       }
  //     }
  //     this.DemoOpenLoading = false;
  //     console.log( this.accountTypeDemo)
  //     console.log(this.accountTypeDemo.length)
  //   }
  // }, (err: any) => {
  //   this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
  //   this.DemoOpenLoading = false;
  // })
}

  /***** SET FORM LIVE  *****/
  setForm(){
    this.linkForm = this.formBuilder.group({

      name: [
        this.linkFormInfo.name,
        [
          Validators.required,
        ],
      ],
      optionId: [
        this.linkFormInfo.optionId,
        [
          Validators.required,
        ],
      ],
    })
  }

  get f() {
    return this.linkForm.controls;
  }


  accountTypeHandle(type:any,event:any,){
    this.linkForm.controls[type].setValue(event.target.value)
  }


  editData(){
    this.isSubmitted = true;
    if (this.linkForm.invalid) return;
    let body = {
      name: this.linkForm.controls['name'].value,
      optionId: this.linkForm.controls['optionId'].value,
    }
   const apiName = API.LINKS + `/${this.data.id}/edit`
   this.apiService.callApiPostRequest(apiName, body).subscribe((res: any) => {
    if (res) {
      this.event.emit({ isSuccess: true });
      this.isSubmitted = false;
      this.toastrService.success('Your Link Has Been Updated');
      this.bsModalService.hide();
      this.isLoading = false;
    }
  }, (err: any) => {
    this.isLoading = false;
    this.toastrService.error(err.error.message || 'Something Went Wrong');
  })
  }


}
