import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionBreakdownComponent } from './commission-breakdown.component';

describe('CommissionBreakdownComponent', () => {
  let component: CommissionBreakdownComponent;
  let fixture: ComponentFixture<CommissionBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionBreakdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
