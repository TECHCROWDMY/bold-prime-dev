import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTraderHistoryComponent } from './account-trader-history.component';

describe('AccountTraderHistoryComponent', () => {
  let component: AccountTraderHistoryComponent;
  let fixture: ComponentFixture<AccountTraderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTraderHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountTraderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
