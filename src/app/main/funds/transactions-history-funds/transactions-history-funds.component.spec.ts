import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsHistoryFundsComponent } from './transactions-history-funds.component';

describe('TransactionsHistoryFundsComponent', () => {
  let component: TransactionsHistoryFundsComponent;
  let fixture: ComponentFixture<TransactionsHistoryFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsHistoryFundsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsHistoryFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
