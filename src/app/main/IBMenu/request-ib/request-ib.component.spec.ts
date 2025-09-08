import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIbComponent } from './request-ib.component';

describe('RequestIbComponent', () => {
  let component: RequestIbComponent;
  let fixture: ComponentFixture<RequestIbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestIbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestIbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
