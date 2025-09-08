import { Component, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-cancel-withdrawal',
  templateUrl: './cancel-withdrawal.component.html',
  styleUrls: ['./cancel-withdrawal.component.scss']
})
export class CancelWithdrawalComponent {
  public event: EventEmitter<any> = new EventEmitter();

  data:any ;

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
  }

    /***** CANCEL DELETE ROW *****/
  cancelData(){
    this.bsModalService.hide();
  }

  withdrawCancel(){
    console.log("test")
    let apiName = this.data.apiName + `/${this.data.id}`
        console.log("test")
    this.apiService.callApiPatchRequest(apiName, {}).subscribe((res: any) => {
      if (res) {
        this.event.emit({ isSuccess: true });
       this.toastrService.success(res.message ? res.message : this.data.deleteMessage)
       this.bsModalService.hide();
      }
    }, (err: any) => {
      this.bsModalService.hide();
      this.toastrService.error(err.error.message ? err.error.message : 'Something Went Wrong');
    })


  }


}
