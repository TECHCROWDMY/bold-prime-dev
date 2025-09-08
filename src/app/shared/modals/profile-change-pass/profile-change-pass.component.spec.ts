import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChangePassComponent } from './profile-change-pass.component';

describe('ProfileChangePassComponent', () => {
  let component: ProfileChangePassComponent;
  let fixture: ComponentFixture<ProfileChangePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileChangePassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileChangePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
