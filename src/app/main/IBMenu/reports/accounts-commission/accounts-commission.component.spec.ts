import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsCommissionComponent } from './accounts-commission.component';

describe('AccountsCommissionComponent', () => {
  let component: AccountsCommissionComponent;
  let fixture: ComponentFixture<AccountsCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsCommissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
