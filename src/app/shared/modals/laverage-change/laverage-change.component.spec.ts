import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaverageChangeComponent } from './laverage-change.component';

describe('LaverageChangeComponent', () => {
  let component: LaverageChangeComponent;
  let fixture: ComponentFixture<LaverageChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaverageChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaverageChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
