import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbTransactionsComponent } from './ib-transactions.component';

describe('IbTransactionsComponent', () => {
  let component: IbTransactionsComponent;
  let fixture: ComponentFixture<IbTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
