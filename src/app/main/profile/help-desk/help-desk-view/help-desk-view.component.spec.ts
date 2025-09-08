import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskViewComponent } from './help-desk-view.component';

describe('HelpDeskViewComponent', () => {
  let component: HelpDeskViewComponent;
  let fixture: ComponentFixture<HelpDeskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeskViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
