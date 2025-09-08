import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstUploadDocumentsComponent } from './first-upload-documents.component';

describe('FirstUploadDocumentsComponent', () => {
  let component: FirstUploadDocumentsComponent;
  let fixture: ComponentFixture<FirstUploadDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstUploadDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstUploadDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
