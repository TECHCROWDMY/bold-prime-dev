
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
  selector: 'app-profile-email-change',
  templateUrl: './profile-email-change.component.html',
  styleUrls: ['./profile-email-change.component.scss']
})
export class ProfileEmailChangeComponent {
  public event: EventEmitter<any> = new EventEmitter();

  subscription: Subscription[] = [];
  modalRef: any;


  isLoading:boolean = false
  isSubmitted:boolean = false

  ProfileChangeEmailForm!: FormGroup;
  ProfileChangeEmailInfo: any = {
    email: '',
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
    this.ProfileChangeEmailForm = this.formBuilder.group({
      email: [
        this.ProfileChangeEmailInfo.email,
        [
          Validators.required,
          emailValidator,
        ],
      ],
      reason: [
        this.ProfileChangeEmailInfo.reason,
        [],
      ],
      pin: [
        this.ProfileChangeEmailInfo.pin,
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
      return this.ProfileChangeEmailForm.controls;
    }


  /***** SUBMITFORM  *****/
  onSubmit() {
    this.isSubmitted = true;
    if (this.ProfileChangeEmailForm.invalid) return;
    this.isLoading = true;
    let body = {
      email: this.ProfileChangeEmailForm.controls['email'].value,
      reason: this.ProfileChangeEmailForm.controls['reason'].value,
      pin: this.ProfileChangeEmailForm.controls['pin'].value,

    }
    this.apiService.callApiPostRequest(API.ACCOUNT_CHANGE_EMAIL, body).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.event.emit({ isSuccess: true });
        this.toastrService.success( 'Your Email Has Been Changed.');
        this.bsModalService.hide()
      }
    }, (err: any) => {
        const msg = err.error.errors.children.email.errors ? err.error.errors.children.email.errors[0]
        :  err.error.errors.children.pin.errors ? err.error.errors.children.pin.errors[0]  : err.error.message
        this.toastrService.error(msg);
      this.isLoading = false;
    })
  }


}
