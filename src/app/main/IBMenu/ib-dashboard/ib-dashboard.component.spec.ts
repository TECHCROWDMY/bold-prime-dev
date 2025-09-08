import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbDashboardComponent } from './ib-dashboard.component';

describe('IbDashboardComponent', () => {
  let component: IbDashboardComponent;
  let fixture: ComponentFixture<IbDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
