import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountChartsComponent } from './account-charts.component';

describe('AccountChartsComponent', () => {
  let component: AccountChartsComponent;
  let fixture: ComponentFixture<AccountChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
