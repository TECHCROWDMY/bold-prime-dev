import { Component, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-banner-get-code',
  templateUrl: './banner-get-code.component.html',
  styleUrls: ['./banner-get-code.component.scss']
})
export class BannerGetCodeComponent {
  public event: EventEmitter<any> = new EventEmitter();

  htmlCode :any ;
  jsCode :any;
  item:any;
  isLoading: any = false;
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
    this.getCode()
  }

  cancelData(){
    this.bsModalService.hide();
  }


    /***** DELETE ROW *****/
    getCode(){
      this.isLoading = true;
      let apiName = this.item.ApiName
      this.apiService.callApiGetRequest(apiName, {}).subscribe((res: any) => {
        if (res) {
          this.htmlCode = res.htmlCode
          this.jsCode = res.jsCode
          this.isLoading = false;
        }
      }, (err: any) => {
        this.isLoading = false;
        this.bsModalService.hide();
        this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
      })


    }




}
