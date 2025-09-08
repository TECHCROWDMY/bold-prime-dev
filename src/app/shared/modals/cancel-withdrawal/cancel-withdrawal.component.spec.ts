import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelWithdrawalComponent } from './cancel-withdrawal.component';

describe('CancelWithdrawalComponent', () => {
  let component: CancelWithdrawalComponent;
  let fixture: ComponentFixture<CancelWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelWithdrawalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
