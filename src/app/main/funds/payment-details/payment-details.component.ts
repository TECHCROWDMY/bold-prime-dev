import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonDeleteComponent } from 'src/app/shared/modals/common-delete/common-delete.component';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent {
  isLoading:any = false;
  isSubmited:any = false;
  subscription: Subscription[] = [];
  paymentList:any = []
  paymentConfigList:any = []
  modalRef: any;
  configArray:any;
  configFieldArray:any = [];
  updateConfigID :any='';
  base64textString:any = [];
  FieldValueArray:any = [];
  files: any = [];
  fileArray: any = [];

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
    private titleService: Title
  ) {
  }

  ngOnInit() {

    this.commonService.setCurrentActiveLink('wallets');
    this.commonService.pageName = 'Payment Details';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getPaymentDetailsList()
    this.getPaymentDetailsConfigList()
  }


  getPaymentDetailsConfigList(){
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.PAYMENT_DETAILS_CONFIG, {}).subscribe((res: any) => {
      if (res) {
        this.paymentConfigList= res;
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }



  uploadType(event:any){
    this.updateConfigID =  event.target.value
    this.configArray =  this.paymentConfigList.filter((item:any)=> item.id == event.target.value)
    this.formUpdateFields();
  }


  formUpdateFields(){
    this.isSubmited = false;
    this.configArray = Object.entries(this.configArray[0].config);
    this.FieldValueArray = [];
    this.configFieldArray = [];
    this.fileArray = [];
    for (let index = 0; index < this.configArray.length; index++) {
      const elementTitle = this.configArray[index][0];
      const elementData = this.configArray[index][1];
      const filedType = this.configArray[index][1].fieldType

      var objectData = Object.entries(elementData);
      var arraytoOBJData  = Object.fromEntries(objectData)

      this.FieldValueArray.push({
        name: elementTitle,
        value: ''
      })

      if (filedType == "file") {
        this.fileArray.push({
          name: elementTitle,
          value: ''
        })
      }
       this.configFieldArray.push({
         ...arraytoOBJData,
         title:elementTitle,
       }) }
  }

  updateValue(event:any , title:any , type:any){
    this.FieldValueArray.filter((item:any,key:any) =>
    { if(type != 'file'){
        if(item.name == title){
          this.FieldValueArray[key].value = event.target.value
        }
      }
    })
  }

  handleFileSelect(evt: any,title:any) {
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




  onSelect(event: any, title: any) {
    if (this.files.length == 0) {
      this.files.push({
        title: title,
        data: event.addedFiles
      })
    } else {
      for (let index = 0; index < this.files.length; index++) {
        const element = this.files[index];
        if (element.title == title) {
          this.files[index].data = [];
          this.files[index].data.push(...event.addedFiles)
          break;
        }
        if ((index + 1) == this.files.length) {
          this.files.push({
            title: title,
            data: event.addedFiles
          })
          break;
        }
      }
    }
    setTimeout(() => {
      this.file64Convert(title)
    }, 200);
  }

  labelHandle(val:any){
    const originalText = val;
    const convertedText = this.capitalizeWords(originalText);
    const result = this.addSpaceAfterFirstCapital(convertedText);
    return result ? result : ""
    
  }
  capitalizeWords(inputString:any) {
    return inputString.replace(/\b\w/g, (match:any) => match.toUpperCase());
}

addSpaceAfterFirstCapital(str:any) {
  // Use a regular expression to find the first capital letter and insert a space
  return str.replace(/([A-Z])/g, ' $1').trim();
}


  onRemove(title: any, fileIndex: any) {
    for (let index = 0; index < this.files.length; index++) {
      const element = this.files[index];
      if (element.title == title) {
        this.files[index].data = this.files[index].data.filter((item: any, key: any) => key !== fileIndex)
        break;
      }
    }
    for (let index = 0; index < this.FieldValueArray.length; index++) {
      const element = this.FieldValueArray[index].name
      if (element == title) {
        this.FieldValueArray[index].value = [];
        break;
      }
    }
    setTimeout(() => {
      this.file64Convert(title);
    }, 200);

  }

  file64Convert(convertTitle: any) {
    for (let index = 0; index < this.files.length; index++) {
      const fileTitle = this.files[index].title
      if (convertTitle == fileTitle) {
        this.base64textString = [];
        const element = this.files[index];
        for (let indexArray = 0; indexArray < element.data.length; indexArray++) {
          const fileItems = element.data[indexArray];
          this.handleFileSelect(fileItems, fileTitle)
          if ((indexArray + 1) == element.data.length) {
            setTimeout(() => {
              this.fileArray[index].value = this.base64textString
              for (let index = 0; index < this.FieldValueArray.length; index++) {
                const element = this.FieldValueArray[index].name
                if (element == convertTitle) {
                  this.FieldValueArray[index].value = this.base64textString
                  break;
                }
              }
              this.isLoading = false;
            }, 200);
          }
        }
      }
    }
  }



  getPaymentDetailsList(){
    this.apiService.callApiGetRequest(API.PAYMENT_LIST, {}).subscribe((res: any) => {
      if (res) {
        this.paymentList= res;
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })

  }
  /***** DELETE LINK MODAL OPEN *****/
  deleteLinks(item: any) {
    this.modalRef = this.bsModalService.show(CommonDeleteComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        data: {
          title: 'Delete payment details',
          desc: 'Are you sure you want to delete this payment detail?',
          apiName: API.PAYMENT_LIST,
          deleteMessage: 'payment detail has been successfully deleted'
        },
        item: item
      },
    });

    const cb = this.modalRef.content.event.subscribe((data: any) => {
      if (data.isSuccess) {
        this.getPaymentDetailsList()
      }
    });

    this.subscription.push(cb);
  }

  submitHandle(){
    this.isSubmited = true;
    this.validationCheck()
  }


  validationCheck(){
    var formSubmit = false;
    for (let index = 0; index < this.FieldValueArray.length; index++) {
      const element = this.FieldValueArray[index].value
      const elementName = this.FieldValueArray[index].name

      const CurrencyName = this.FieldValueArray[0].name
      const CurrencyValue = this.FieldValueArray[0].value


      if(CurrencyName == "Currency" && CurrencyValue == 'IDR'  && elementName =='Bank IDR' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      } else if(CurrencyName == "Currency" && CurrencyValue == 'INR'  && elementName =='Bank INR' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'MYR'  && elementName =='Bank MYR' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'XAF'  && elementName =='Bank XAF' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'THB'  && elementName =='Bank THB' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'VND'  && elementName =='Bank VND' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      } else  if(CurrencyName == "Currency" && CurrencyValue == 'SGD'  && elementName =='Bank SGD' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      } else if(CurrencyName == "Currency" && CurrencyValue == 'KES'  && elementName =='Bank KES' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'GHS'  && elementName =='Bank GHS' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'NGN'  && elementName =='Bank NGN' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'TZS'  && elementName =='Bank TZS' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      } 
      else if(CurrencyName == "Currency" && CurrencyValue == 'ZAR'  && elementName =='Bank ZAR' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'UGX'  && elementName =='Bank UGX' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'ZMW'  && elementName =='Bank ZMW' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'RWF'  && elementName =='Bank RWF' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      } else  if(CurrencyName == "Currency" && CurrencyValue == 'ZAF'  && elementName =='Bank ZAF' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      } else if(CurrencyName == "Currency" && CurrencyValue == 'BIF'  && elementName =='Bank BIF' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'PHP'  && elementName =='Bank PHP' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'PEN'  && elementName =='Bank PEN' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'CHL'  && elementName =='Bank CHL' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }  else if(CurrencyName == "Currency" && CurrencyValue == 'COP'  && elementName =='Bank COP' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'MXN'  && elementName =='Bank MXN' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if(CurrencyName == "Currency" && CurrencyValue == 'BRL'  && elementName =='Bank BRL' && (element == '' || element.length == 0 || element == undefined)){
        formSubmit = true;
        break;
      }else if (CurrencyName == "Currency" && CurrencyValue == 'IDR' &&
      (
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'INR' &&
      (elementName == 'Bank IDR' ||
    
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL')
      && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    }
    else if (CurrencyName == "Currency" && CurrencyValue == 'XAF' &&
    (elementName == 'Bank IDR' ||
    elementName == 'Bank INR' ||
      elementName == 'Bank MYR' ||
      elementName == 'Bank THB' ||
      elementName == 'Bank VND' ||
      elementName == 'Bank SGD' ||
      elementName == 'Bank KES' ||
      elementName == 'Bank GHS' ||
      elementName == 'Bank NGN' ||
      elementName == 'Bank TZS' ||
      elementName == 'Bank ZAR' ||
      elementName == 'Bank UGX' ||
      elementName == 'Bank ZMW' ||
      elementName == 'Bank RWF' ||
      elementName == 'Bank ZAF' ||
      elementName == 'Bank BIF' ||
      elementName == 'Bank PHP' ||
      elementName == 'Bank PEN' ||
      elementName == 'Bank CHL' ||
      elementName == 'Bank COP' ||
      elementName == 'Bank MXN' ||
      elementName == 'Bank BRL')
    && (element == '' || element.length == 0 || element == undefined)) {
    this.FieldValueArray[index].value = ''
    formSubmit = false;
  } else if (CurrencyName == "Currency" && CurrencyValue == 'MYR' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
    
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'THB' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
    
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'VND' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
    
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'SGD' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
    
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'KES' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
    
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL')
      && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'GHS' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
    
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'NGN' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
    
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'TZS' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
    
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'ZAR' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
    
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'UGX' && (elementName == 'Bank IDR' ||
      elementName == 'Bank INR' ||
      elementName == 'Bank MYR' ||
      elementName == 'Bank THB' ||
      elementName == 'Bank VND' ||
      elementName == 'Bank SGD' ||
      elementName == 'Bank KES' ||
      elementName == 'Bank GHS' ||
      elementName == 'Bank NGN' ||
      elementName == 'Bank TZS' ||
      elementName == 'Bank ZAR' ||
    
      elementName == 'Bank ZMW' ||
      elementName == 'Bank RWF' ||
      elementName == 'Bank ZAF' ||
      elementName == 'Bank BIF' ||
      elementName == 'Bank PHP' ||
      elementName == 'Bank PEN' ||
      elementName == 'Bank CHL' ||
      elementName == 'Bank COP' ||
      elementName == 'Bank MXN' ||
      elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'ZMW' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
    
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'RWF' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
    
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'ZAF' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
    
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'BIF' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
    
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'PHP' && (elementName == 'Bank IDR' ||
      elementName == 'Bank INR' ||
      elementName == 'Bank MYR' ||
      elementName == 'Bank THB' ||
      elementName == 'Bank VND' ||
      elementName == 'Bank SGD' ||
      elementName == 'Bank KES' ||
      elementName == 'Bank GHS' ||
      elementName == 'Bank NGN' ||
      elementName == 'Bank TZS' ||
      elementName == 'Bank ZAR' ||
      elementName == 'Bank UGX' ||
      elementName == 'Bank ZMW' ||
      elementName == 'Bank RWF' ||
      elementName == 'Bank ZAF' ||
      elementName == 'Bank BIF' ||
    
      elementName == 'Bank PEN' ||
      elementName == 'Bank CHL' ||
      elementName == 'Bank COP' ||
      elementName == 'Bank MXN' ||
      elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'PEN' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'CHL' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'COP' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank MXN' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'MXN' &&
      (elementName == 'Bank IDR' ||
        elementName == 'Bank INR' ||
        elementName == 'Bank MYR' ||
        elementName == 'Bank THB' ||
        elementName == 'Bank VND' ||
        elementName == 'Bank SGD' ||
        elementName == 'Bank KES' ||
        elementName == 'Bank GHS' ||
        elementName == 'Bank NGN' ||
        elementName == 'Bank TZS' ||
        elementName == 'Bank ZAR' ||
        elementName == 'Bank UGX' ||
        elementName == 'Bank ZMW' ||
        elementName == 'Bank RWF' ||
        elementName == 'Bank ZAF' ||
        elementName == 'Bank BIF' ||
        elementName == 'Bank PHP' ||
        elementName == 'Bank PEN' ||
        elementName == 'Bank CHL' ||
        elementName == 'Bank COP' ||
        elementName == 'Bank BRL') && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (CurrencyName == "Currency" && CurrencyValue == 'BRL' && (elementName == 'Bank IDR' ||
      elementName == 'Bank INR' ||
      elementName == 'Bank MYR' ||
      elementName == 'Bank THB' ||
      elementName == 'Bank VND' ||
      elementName == 'Bank SGD' ||
      elementName == 'Bank KES' ||
      elementName == 'Bank GHS' ||
      elementName == 'Bank NGN' ||
      elementName == 'Bank TZS' ||
      elementName == 'Bank ZAR' ||
      elementName == 'Bank UGX' ||
      elementName == 'Bank ZMW' ||
      elementName == 'Bank RWF' ||
      elementName == 'Bank ZAF' ||
      elementName == 'Bank BIF' ||
      elementName == 'Bank PHP' ||
      elementName == 'Bank PEN' ||
      elementName == 'Bank CHL' ||
      elementName == 'Bank COP' ||
      elementName == 'Bank MXN' ) && (element == '' || element.length == 0 || element == undefined)) {
      this.FieldValueArray[index].value = ''
      formSubmit = false;
    } else if (element == '' || element.length == 0 || element == undefined) {
      formSubmit = true;
      break;
    }
      // else if(CurrencyName == "Currency" && CurrencyValue == 'IDR' && (elementName =='Bank INR' || elementName =='Bank MYR' ||elementName =='Bank THB' ||elementName =='Bank VND' ) && (element == '' || element.length == 0 || element == undefined)){
      //   this.FieldValueArray[index].value = ''
      //   formSubmit = false;
      // }else if(CurrencyName == "Currency" && CurrencyValue == 'INR' && (elementName =='Bank IDR' || elementName =='Bank MYR' || elementName =='Bank THB' ||elementName =='Bank VND' ) && (element == '' || element.length == 0 || element == undefined)){
      //   this.FieldValueArray[index].value = ''
      //   formSubmit = false;
      // }else if(CurrencyName == "Currency" && CurrencyValue == 'MYR' && (elementName =='Bank INR' || elementName =='Bank IDR' ||elementName =='Bank THB' ||elementName =='Bank VND' ) && (element == '' || element.length == 0 || element == undefined)){
      //   this.FieldValueArray[index].value = ''
      //   formSubmit = false;
      // }else if(CurrencyName == "Currency" && CurrencyValue == 'THB' && (elementName =='Bank INR' || elementName =='Bank IDR' ||elementName =='Bank MYR' ||elementName =='Bank VND' ) && (element == '' || element.length == 0 || element == undefined)){
      //   this.FieldValueArray[index].value = ''
      //   formSubmit = false;
      // }else if(CurrencyName == "Currency" && CurrencyValue == 'VND' && (elementName =='Bank INR' || elementName =='Bank MYR' ||elementName =='Bank THB' ||elementName =='Bank IDR' ) && (element == '' || element.length == 0 || element == undefined)){
      //   this.FieldValueArray[index].value = ''
      //   formSubmit = false;
      // }else if( element == '' || element.length == 0 || element == undefined){
      //   formSubmit = true;
      //   break;
      // }

    }
    if(this.updateConfigID == '') return;
    if(!formSubmit){
      this.submitPaymentDetails()
    }
  }
  removeByAttr(arr: any, attr: any, value: any) {
    var i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value)) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }


  submitPaymentDetails(){
    this.isLoading = true;
    var datafields:any= [];
     this.FieldValueArray.map((item:any) =>{
       datafields.push({key: item.name , value : item.value})
    })

    this.fileArray.map((item: any) => {
      this.removeByAttr(datafields, 'key', item.name);
      datafields.push({ key: item.name, value: item.value })
    })

    let body:any  = {
     data : datafields,
     configId: this.updateConfigID
    }

     this.apiService.callApiPostRequest(API.PAYMENT_ACCOUNT_UPLOAD, body).subscribe((res: any) => {
       if (res) {
         this.getPaymentDetailsList()
         this.toastrService.success('Uploaded Payment Details Successfully');
         this.configFieldArray = []
         this.updateConfigID = '';
         this.isLoading = false;
         this.isSubmited = false;
       }
     }, (err: any) => {
       this.isLoading = false;
       this.toastrService.error(err.error.errors.children.data.errors ? err.error.errors.children.data.errors[0] : 'something went wrong');
     })

   }

}
