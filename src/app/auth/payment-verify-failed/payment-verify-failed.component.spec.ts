import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVerifyFailedComponent } from './payment-verify-failed.component';

describe('PaymentVerifyFailedComponent', () => {
  let component: PaymentVerifyFailedComponent;
  let fixture: ComponentFixture<PaymentVerifyFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentVerifyFailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentVerifyFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
