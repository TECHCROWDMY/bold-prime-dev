import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbDashboardShowComponent } from './ib-dashboard-show.component';

describe('IbDashboardShowComponent', () => {
  let component: IbDashboardShowComponent;
  let fixture: ComponentFixture<IbDashboardShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbDashboardShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbDashboardShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
