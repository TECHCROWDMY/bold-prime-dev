import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestLeadersComponent } from './contest-leaders.component';

describe('ContestLeadersComponent', () => {
  let component: ContestLeadersComponent;
  let fixture: ComponentFixture<ContestLeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestLeadersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestLeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
