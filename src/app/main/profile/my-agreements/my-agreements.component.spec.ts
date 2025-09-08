import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAgreementsComponent } from './my-agreements.component';

describe('MyAgreementsComponent', () => {
  let component: MyAgreementsComponent;
  let fixture: ComponentFixture<MyAgreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAgreementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
