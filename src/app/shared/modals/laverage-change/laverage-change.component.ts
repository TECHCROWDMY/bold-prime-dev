
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

@Component({
  selector: 'app-laverage-change',
  templateUrl: './laverage-change.component.html',
  styleUrls: ['./laverage-change.component.scss']
})
export class LaverageChangeComponent {
  public event: EventEmitter<any> = new EventEmitter();

  subscription: Subscription[] = [];
  modalRef: any;
  isSubmitted: any = false;
  isLoading: boolean = false
  leverageItem: any;
  leverageValue: any = '';
  leverageList: any = [
    { name: '1:2000', value: '2000' },
    { name: '1:1000', value: '1000' },
    { name: '1:500', value: '500' },
    { name: '1:400', value: '400' },
    { name: '1:300', value: '300' },
    { name: '1:200', value: '200' },
    { name: '1:100', value: '100' },
    { name: '1:50', value: '50' },
    { name: '1:33', value: '33' },
    { name: '1:10', value: '10' },
    { name: '1:5', value: '5' },
    { name: '1:2', value: '2' },
    { name: '1:1', value: '1' },
  ]
  constructor(
    public bsModalService: BsModalService,
    public commonService: CommonService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
  }

  submitLeverageHandle() {
    this.isSubmitted = true;
    if (this.leverageValue == '') return;
    this.isLoading = true;
    let body = {
      loginSid: this.leverageItem.loginSID,
      leverage: Number(this.leverageValue),
    }
    this.apiService.callApiPostRequest(API.ACCOUNTS_CHANGE_LEVERAGE, body).subscribe((res: any) => {
      if (res) {
        this.isSubmitted = false;
        this.event.emit({ isSuccess: true });
        this.isLoading = false;
        this.toastrService.success('Success');
        this.bsModalService.hide();
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'Something Went Wrong');
      this.isLoading = false;
      this.isSubmitted = false;
    })

  }


  leverageHandle(event: any) {
    this.leverageValue = event.target.value
  }
}
