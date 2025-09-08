import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccChangePassEmailComponent } from './acc-change-pass-email.component';

describe('AccChangePassEmailComponent', () => {
  let component: AccChangePassEmailComponent;
  let fixture: ComponentFixture<AccChangePassEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccChangePassEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccChangePassEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
