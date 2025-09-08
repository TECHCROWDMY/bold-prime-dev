
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { API } from '../../constants/constant';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../../custom-validator/confirmed.validator';
import { ActivatedRoute } from '@angular/router';
import { emailValidator } from '../../custom-validator/email.validator';

@Component({
  selector: 'app-profile-mobile-change',
  templateUrl: './profile-mobile-change.component.html',
  styleUrls: ['./profile-mobile-change.component.scss']
})
export class ProfileMobileChangeComponent {
  public event: EventEmitter<any> = new EventEmitter();

  subscription: Subscription[] = [];
  modalRef: any;


  isLoading:boolean = false
  isSubmitted:boolean = false

  ProfileChangeMobileForm!: FormGroup;
  ProfileChangeMobileInfo: any = {
    phone: '',
    reason: '',
    pin:''
  };


  constructor(
    public bsModalService: BsModalService,
    public commonService: CommonService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.setForm()
  }

   /***** FORM SETUP   *****/
   setForm() {
    this.ProfileChangeMobileForm = this.formBuilder.group({
      phone: [
        this.ProfileChangeMobileInfo.phone,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
        ],
      ],
      reason: [
        this.ProfileChangeMobileInfo.reason,
        [],
      ],
      pin: [
        this.ProfileChangeMobileInfo.pin,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],
    },
    )
  }


    /***** FORM CONTROL  *****/
    get f() {
      return this.ProfileChangeMobileForm.controls;
    }



  /***** SUBMITFORM  *****/
  onSubmit() {
    this.isSubmitted = true;
    if (this.ProfileChangeMobileForm.invalid) return;
    this.isLoading = true;
    let body = {
      phone: '+' + this.ProfileChangeMobileForm.controls['phone'].value,
      reason: this.ProfileChangeMobileForm.controls['reason'].value,
      pin: this.ProfileChangeMobileForm.controls['pin'].value,

    }
    this.apiService.callApiPostRequest(API.ACCOUNT_CHANGE_MOBILE, body).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.event.emit({ isSuccess: true });
        this.toastrService.success( 'Your Mobile Number Has Been Changed.');
        this.bsModalService.hide()
      }
    }, (err: any) => {
        const msg = err.error.errors.children.phone.errors ? err.error.errors.children.phone.errors[0]
        :  err.error.errors.children.pin.errors ? err.error.errors.children.pin.errors[0]  : err.error.message
        this.toastrService.error(msg);
      this.isLoading = false;
    })
  }

}
