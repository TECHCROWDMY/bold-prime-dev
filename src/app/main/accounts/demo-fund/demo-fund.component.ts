import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-demo-fund',
  templateUrl: './demo-fund.component.html',
  styleUrls: ['./demo-fund.component.scss']
})
export class DemoFundComponent  implements OnInit {
  myForm!: FormGroup;
  isLoading: any = false;
  loginSID: any = ""

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.loginSID = this.route.snapshot.paramMap.get('id')
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      depositAmmount: ['1000'],
    });
  }

  onSubmit(){
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      this.isLoading = false;
      this.router.navigate([`app/accounts/show/${this.loginSID}`]);
      this.toastrService.success('Deposit is completed successfully');
    } else{
      this.isLoading = false;
      this.toastrService.error('something went wrong');
    }
  }
}
