import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-ib',
  templateUrl: './request-ib.component.html',
  styleUrls: ['./request-ib.component.scss']
})
export class RequestIbComponent implements OnInit {
  requestForm!: FormGroup;
  isSubmitted: any = false;
  isLoading: any = false;
  userDetails: any;
  accountList: any;
  loginSid: any;

  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      Currency: ['', Validators.required],
    });
    // this.getAccountList();
  }

  get f() {
    return this.requestForm.controls;
  }

  onCurrencyChange() {
    // Clear the error message related to the 'Currency' field
    if (this.requestForm.controls['Currency']) {
      this.requestForm.controls['Currency'].setErrors(null);
    }
  }

  // getAccountList() {
  //   this.isLoading = true;
  //   this.apiService.callApiPostRequest(API.ACCOUNTS, {category: 'demo', scope: 'all'}).subscribe((res: any) => {
  //     if (res) {
  //       this.isLoading = false;
  //       this.accountList = res;
  //       this.loginSid = this.accountList[0] ? this.accountList[0].loginSid : 0;
  //     }
  //   }, (err: any) => {
  //     this.isLoading = false;
  //     this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
  //   })
  // }

  /***** SUBMIT FORM  *****/
  onSubmit() {
    this.isSubmitted = true;
    if (this.requestForm.invalid) return;
    this.isLoading = true;
    let selectedCurrency = this.requestForm.get('Currency')?.value;

    let requestBody = {
      sections: [
        {
          key: "applications.questionnaire.step1",
          fields: [
            {
              "key": "Select IB Account currency",
              "value": selectedCurrency,
            }
          ]
        }
      ],
      configId: 15, // Check this value
      // loginSid: this.loginSid
    };

    this.apiService.callApiPostRequest(API.REQUEST_IB, requestBody).subscribe((res: any) => {
      if(res){
        this.isSubmitted = false;
        const storedUserDetailsString = localStorage.getItem('boldUserDetail') || '{}';
        const storedUserDetails = JSON.parse(storedUserDetailsString);
        storedUserDetails.isIb = true;
        this.userDetails = localStorage.setItem('boldUserDetail', JSON.stringify(storedUserDetails));
        this.toastrService.success('IB Request Send Successfully');
        if(storedUserDetails.isIb == true){
          this.router.navigate(['app/ib-dashboard'], { queryParams: { isIb: "true" }}).then(() => {
            location.reload();
          });
        }
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.errors.children.loginSid.errors ? err.error.errors.children.loginSid.errors[0] : 'something went wrong');
    })
  }
}
