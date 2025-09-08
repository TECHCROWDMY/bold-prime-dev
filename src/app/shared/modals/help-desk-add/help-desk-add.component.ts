
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { API } from '../../constants/constant';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-help-desk-add',
  templateUrl: './help-desk-add.component.html',
  styleUrls: ['./help-desk-add.component.scss']
})
export class HelpDeskAddComponent {
  public event: EventEmitter<any> = new EventEmitter();

  helpDeskForm!: FormGroup;
  subscription: Subscription[] = [];
  updateImage:any=[];
  categoriesList:any;
  isSubmitted:boolean = false
  isLoading:boolean = false;
  helpDeskFormInfo: any = {
    category: '',
    title: '',
    text:'',
  };
  attachments:any = []
  base64textString:any = []
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

    this.getCategoryType()
   this.setFormLive()
  }


 /***** GET ACCOUNT TYPE FROM FORM VALUE  *****/
 getCategoryType(){
  this.isLoading = true;
  this.apiService.callApiGetRequest(API.HELP_DESK_CATEGORIES, {}).subscribe((res: any) => {
    if (res) {
      this.isLoading = false;
      this.categoriesList = Object.keys(res);
    }
  }, (err: any) => {
    this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    this.isLoading = false;
  })
}


  /***** VALIDATION FUNCTION IN HTML PAGE   *****/
  get f() {
    return this.helpDeskForm.controls;
  }


   /***** SET FORM LIVE  *****/
   setFormLive(){
    this.helpDeskForm = this.formBuilder.group({
      category: [
        this.helpDeskFormInfo.category,
        [
          Validators.required,
        ],
      ],
      title: [
        this.helpDeskFormInfo.title,
        [
          Validators.required,
          Validators.minLength(2),
        ],
      ],
      text: [
        this.helpDeskFormInfo.text,
        [
          Validators.required,
          Validators.minLength(2),
        ],
      ],
    })
  }

  backHandle(){
     this.bsModalService.hide()
  }

  onSubmitHandle(){
    this.isSubmitted = true;
    if (this.helpDeskForm.invalid) return;
    this.isLoading = true;

    let body = {
      category:   this.helpDeskForm.controls['category'].value,
      title:   this.helpDeskForm.controls['title'].value,
      text:   this.helpDeskForm.controls['text'].value,
      attachments: this.base64textString

    }
    this.apiService.callApiPostRequest(API.HELP_DESK_CREATE, body).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.event.emit({ isSuccess: true });
        this.toastrService.success('Ticket Create Successful');
        this.bsModalService.hide()
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'Something Went Wrong');
      this.isLoading = false;
    })

  }

  uploadNewFiles(event: any) {
    this.base64textString = [];
    this.updateImage.push(...event.addedFiles)
    for (let index = 0; index < this.updateImage.length; index++) {
      const element = this.updateImage[index]
      this.handleFileSelect(element)
    }
  }

  image64Convert(index:any){
    var val = this.base64textString[index]?.file
   const base64 = val ?  'data:image/jpeg;base64,' + val : ''
    return base64;
  }

  onRemove(index:any){
    this.updateImage = this.updateImage.filter((item:any,key:any)=> key != index);
  }
  handleFileSelect(evt: any) {
    var files = evt;
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(files);

  }

  // Front Side
  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString.push({
      name: `file${this.base64textString.length + 1}`,
      file: btoa(binaryString)
    })
  }


}
