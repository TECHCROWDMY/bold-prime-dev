import { Injectable } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ModalService {

  imageCropperFile: any = '';
  imageCropperRatio = '16 / 9';

  constructor(
    modalDirective: ModalDirective
  ) { }

  public imageCropperModal = new BehaviorSubject<any>({});
  imageCropperModalData = this.imageCropperModal.asObservable();

  public saveCroppedImage = new BehaviorSubject<any>({});
  saveCroppedImageData = this.saveCroppedImage.asObservable();
}
