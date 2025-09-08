import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMobileChangeComponent } from './profile-mobile-change.component';

describe('ProfileMobileChangeComponent', () => {
  let component: ProfileMobileChangeComponent;
  let fixture: ComponentFixture<ProfileMobileChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileMobileChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMobileChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
