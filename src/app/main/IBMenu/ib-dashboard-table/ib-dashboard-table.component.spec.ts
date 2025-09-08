import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbDashboardTableComponent } from './ib-dashboard-table.component';

describe('IbDashboardTableComponent', () => {
  let component: IbDashboardTableComponent;
  let fixture: ComponentFixture<IbDashboardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbDashboardTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbDashboardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
