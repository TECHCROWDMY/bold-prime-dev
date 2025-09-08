import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoFundComponent } from './demo-fund.component';

describe('DemoFundComponent', () => {
  let component: DemoFundComponent;
  let fixture: ComponentFixture<DemoFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoFundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
