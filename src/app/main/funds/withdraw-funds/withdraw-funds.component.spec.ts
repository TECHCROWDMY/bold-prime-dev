import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawFundsComponent } from './withdraw-funds.component';

describe('WithdrawFundsComponent', () => {
  let component: WithdrawFundsComponent;
  let fixture: ComponentFixture<WithdrawFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawFundsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
