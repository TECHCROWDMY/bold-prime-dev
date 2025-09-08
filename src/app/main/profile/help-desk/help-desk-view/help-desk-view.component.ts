import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API } from 'src/app/shared/constants/constant';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonDeleteComponent } from 'src/app/shared/modals/common-delete/common-delete.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-help-desk-view',
  templateUrl: './help-desk-view.component.html',
  styleUrls: ['./help-desk-view.component.scss']
})
export class HelpDeskViewComponent {
  isSubmited: any = false;
  isLoading: any = false;
  helpDeskDetails: any = [];
  id: any = '';
  subscription: Subscription[] = []
  updateMessageText: any = '';
  updateImage: any = [];
  base64textString: any = [];
  modalRef: any;
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    public bsModalService: BsModalService,
    private titleService: Title
  ) {
    this.id = this.route.snapshot.paramMap.get('id')
  }


  ngOnInit() {
    this.commonService.setCurrentActiveLink('help-desk/show');
    this.commonService.pageName = 'Help Desk';
    this.titleService.setTitle("Bold Prime | " + this.commonService.pageName);
    this.getTicketsData()
  }


  getTicketsData() {
    this.isLoading = true;
    var APINAME = API.HELP_DESK_DETAILS + `/${this.id}`
    this.apiService.callApiGetRequest(APINAME, {}).subscribe((res: any) => {
      if (res) {
        this.isLoading = false;
        this.helpDeskDetails = res;
        console.log(this.helpDeskDetails)
      }
    }, (err: any) => {
      this.isLoading = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }

  dateFormate(val: any) {
    if (val) {
      let date = moment(val).format("DD-MM-YYYY, h:mma");
      return date;
    } else {
      return ''
    }
  }

  getDataRow(val: any) {
    var finalValue: any
    const baseURL = API.IMAGE_BASE_URL
    finalValue = `${baseURL}${val}`
    return finalValue ? finalValue : '';
  }

  imageNpdfModal(item: any) {
    const baseURL = API.OPEN_FILES
    const openURL = `${baseURL}${item}`
    window.open(openURL)
    return;
  }

  imageModal(val: any) {
    var finalValue: any
    const baseURL = API.IMAGE_BASE_URL
    finalValue = `${baseURL}${val}`

  }

  closeHelpDesk(type: any) {
    this.isSubmited = false;
    this.isLoading = true
    var apiName: any;
    if (type == 'close') {
      apiName = API.HELP_DESK_CLOSE_DELETE + `/${this.id}/close`
      this.apiService.callApiPostRequest(apiName, {}).subscribe((res: any) => {
        this.isLoading = false
        if (res) {
          this.toastrService.success('Success');
          this.router.navigate(['/app/help-desk']);
        }
      }, (err: any) => {
        this.isLoading = false;
        this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
      })
    } else if (type == 'delete') {
      apiName = API.HELP_DESK_CLOSE_DELETE
      this.modalRef = this.bsModalService.show(CommonDeleteComponent, {
        animated: true,
        backdrop: 'static',
        class: 'modal-dialog-centered modal-sm',
        initialState: {
          data: {
            title: 'Delete Ticket',
            desc: 'Are you sure you want to delete this ticket?',
            apiName: apiName,
            deleteMessage: 'ticket has been successfully deleted'
          },
          item: {
            id: this.id
          }
        },
      });

      const cb = this.modalRef.content.event.subscribe((data: any) => {
        if (data.isSuccess) {
          this.router.navigate([`/app/help-desk`]);
        }
      });

      this.subscription.push(cb);
    }
  }
  uploadNewFiles(event: any) {
    this.base64textString = [];
    this.updateImage.push(...event.addedFiles)
    for (let index = 0; index < this.updateImage.length; index++) {
      const element = this.updateImage[index]
      this.handleFileSelect(element)
    }
  }
  onRemove(index: any) {
    this.updateImage = this.updateImage.filter((item: any, key: any) => key != index);
  }
  uploadNewText(event: any) {
    this.updateMessageText = event.target.value
  }

  handleFileSelect(evt: any) {
    var files = evt;
    if (files) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(files);
    }
  }

  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString.push({
      key: btoa(binaryString)
    })
  }

  submitMassageHandle() {
    this.isSubmited = true;
    if (this.updateMessageText) {
      this.isLoading = true;
      this.base64textString = [];
      for (let index = 0; index < this.updateImage.length; index++) {
        const element = this.updateImage[index]
        this.handleFileSelect(element)
      }
      setTimeout(() => {
        this.submitHandle();
      }, 2000);
    }
  }

  image64Convert(index: any) {
    var val = this.base64textString[index].key
    const base64 = 'data:image/jpeg;base64,' + val
    return base64;
  }

  submitHandle() {
    var attachments: any = [];
    for (let index = 0; index < this.base64textString.length; index++) {
      const element = this.base64textString[index].key;
      attachments.push({
        name: this.updateImage[index].name,
        file: element
      })
    }
    let body = {
      ticket: this.id,
      text: this.updateMessageText,
      attachments: attachments
    }
    this.apiService.callApiPostRequest(API.HELP_DESK_CREATE_MASSAGE, body).subscribe((res: any) => {
      if (res) {
        console.log(res)
        this.base64textString = [];
        this.updateImage = []
        this.updateMessageText = ''
        this.getTicketsData();
        this.isSubmited = false;
      }
    }, (err: any) => {
      this.isLoading = false;
      this.isSubmited = false;
      this.toastrService.error(err.error.message ? err.error.message : 'something went wrong');
    })
  }



}

