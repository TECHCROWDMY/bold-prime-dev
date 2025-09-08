import { Component, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-common-delete',
  templateUrl: './common-delete.component.html',
  styleUrls: ['./common-delete.component.scss']
})
export class CommonDeleteComponent {
  public event: EventEmitter<any> = new EventEmitter();

  data:any ;
  item:any;

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

    /***** DELETE ROW *****/
  deleteData(){
    let apiName = this.data.apiName + `/${this.item.id}`
    this.apiService.callApiDeleteRequest(apiName, {}).subscribe((res: any) => {
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
