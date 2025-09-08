import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordOtpverifyComponent } from './forgot-password-otpverify.component';

describe('ForgotPasswordOtpverifyComponent', () => {
  let component: ForgotPasswordOtpverifyComponent;
  let fixture: ComponentFixture<ForgotPasswordOtpverifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPasswordOtpverifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordOtpverifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
