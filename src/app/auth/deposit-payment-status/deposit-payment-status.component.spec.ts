import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentStatusComponent } from './deposit-payment-status.component';

describe('DepositPaymentStatusComponent', () => {
  let component: DepositPaymentStatusComponent;
  let fixture: ComponentFixture<DepositPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositPaymentStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
