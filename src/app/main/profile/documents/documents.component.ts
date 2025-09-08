import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonDeleteComponent } from 'src/app/shared/modals/common-delete/common-delete.component';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {


  countryList: any = [];
  isLoading: any = false;
  docLists: any = [];
  docConfig: any = []
  configArray: any;
  updateConfigID: any
  configFieldArray: any = [];
  base64textString: any = [];
  FieldValueArray: any = [];
  isSubmited: any = false;
  files: any = [];
  fileArray: any = [];
  modalRef: any;
  subscription: Subscription[] = [];
  keyName: string = '';
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
    private titleService: Title
  ) { }


  ngOnInit() {
    this.commonService.setCurrentActiveLink('documents');
    this.commonService.pageName = 'Upload New Documents';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getDocList();
    this.getConfig();
    this.getCountryList();
  }


  /***** DOCUMENT APP LIST   *****/
  getDocList() {
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.DOCUMENTS_LISTS, {}).subscribe((res: any) => {
      if (res) {
        this.docLists = res
        this.isLoading = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  removespaceClass(val: any) {
    const value = val.replaceAll(' ', '-').toLowerCase();
    return value;
  }
  getCountryList() {
    this.apiService.callApiGetRequest(API.REGISTER, {}).subscribe((res: any) => {
      if (res) {
        const resData = res.properties
        const countryData = resData.country.options.enum_titles
        const countryNumber = resData.country.enum
        for (let index = 0; index < countryData.length; index++) {
          this.countryList.push({
            name: countryData[index],
            value: countryData[index],
            number: countryNumber[index] ? countryNumber[index] : 'IN'
          })
        }
      }
    }, (err: any) => {
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }
  /***** DOWNLOAD APP LIST   *****/
  getConfig() {
    this.isLoading = true;
    this.apiService.callApiGetRequest(API.DOCUMENTS_CONFIG, {}).subscribe((res: any) => {
      if (res) {
        this.docConfig = res
        this.isLoading = false;
        this.updateConfigID = res[0].id
        this.uploadTypes()
        if(this.router.url.split('=')[1] != undefined){
          this.keyName = this.router.url.split('=')[1] === 'id-passport' ? "ID/Passport" :  "Proof of Address"
        }
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  changeDropLabel(labelName: any) {
    const originalText = labelName;
    const convertedText = this.capitalizeWords(originalText);
    return convertedText


  }

  capitalizeWords(inputString: any) {
    return inputString.replace(/\b\w/g, (match: any) => match.toUpperCase());
  }


  formUpdateFields() {
    this.isSubmited = false;
    this.configArray = Object.entries(this.configArray[0].config);
    this.configFieldArray = [];
    this.FieldValueArray = [];
    this.fileArray = [];
    this.files = [];
    for (let index = 0; index < this.configArray.length; index++) {
      const elementTitle = this.configArray[index][0];
      const elementData = this.configArray[index][1]
      const filedType = this.configArray[index][1].fieldType
      var objectData = Object.entries(elementData);
      var arraytoOBJData = Object.fromEntries(objectData)

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
        title: elementTitle,
      })
    }
  }

  uploadTypes() {
    this.updateConfigID = this.updateConfigID
    this.configArray = this.docConfig.filter((item: any) => item.id == this.updateConfigID)
    this.formUpdateFields();
  }

  uploadType(event: any) {
    this.updateConfigID = event.target.value
    this.configArray = this.docConfig.filter((item: any) => item.id == event.target.value)
    this.formUpdateFields();
  }


  deleteLinks(item: any) {
    this.modalRef = this.bsModalService.show(CommonDeleteComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-sm',
      initialState: {
        data: {
          title: 'Delete Document',
          desc: 'Are you sure you want to delete this document?',
          apiName: API.DOCUMENTS_LISTS,
          deleteMessage: 'document has been successfully deleted'
        },
        item: item
      },
    });
    const cb = this.modalRef.content.event.subscribe((data: any) => {
      if (data.isSuccess) {
        this.getDocList()
        location.reload();
      }
    });

    this.subscription.push(cb);
  }

  updateValue(event: any, title: any, type: any) {
    this.FieldValueArray.filter((item: any, key: any) => {
      if (type == 'date') {
        if (item.name == title) {
          this.FieldValueArray[key].value = moment(event).format("YYYY-MM-DD");
        }
      } else if (type != 'file') {
        if (item.name == title) {
          this.FieldValueArray[key].value = event.target.value
        }
      }

    })
  }


  handleFileSelect(evt: any, title: any) {
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

  // test(val: any) {
  //   const base64 = 'data:image/jpeg;base64,' + val
  //   return base64;
  // }

  uploadDocSubmit() {
    this.isSubmited = true;
    this.validationCheck();
  }

  ChangeLabelManage(labelname: any) {
    // console.log(labelname)
    var updateLabel = ''
    if (labelname == 'Type') {
      updateLabel = 'Category'
    } else {
      updateLabel = labelname
    }
    return updateLabel
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

  validationCheck() {
    var formSubmit = false;
    for (let index = 0; index < this.FieldValueArray.length; index++) {
      const element = this.FieldValueArray[index].value
      if (element == '' || element.length == 0 || element == undefined) {
        formSubmit = true;
      }
    }
    if (!formSubmit) {
      this.submitDoc()
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

  submitDoc() {
    this.isLoading = true;
    var datafields: any = [];
    this.FieldValueArray.map((item: any) => {
      datafields.push({ key: item.name, value: item.value })
    })

    this.fileArray.map((item: any) => {
      this.removeByAttr(datafields, 'key', item.name);
      datafields.push({ key: item.name, value: item.value })
    })
    let body: any = {
      data: datafields,
      configId: this.updateConfigID,
    }

    this.apiService.callApiPostRequest(API.DOCUMENTS_UPLOAD, body).subscribe((res: any) => {
      if (res) {
        this.getDocList();
        this.uploadTypes();
        this.toastrService.success('Uploaded Document Details Successfully');
        this.isSubmited = false;
        this.isLoading = false;
        location.reload();
      }
    }, (err: any) => {
      this.isLoading = false;
      console.log(err.error.message);
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }
}
