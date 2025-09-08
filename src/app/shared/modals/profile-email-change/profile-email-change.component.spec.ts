import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEmailChangeComponent } from './profile-email-change.component';

describe('ProfileEmailChangeComponent', () => {
  let component: ProfileEmailChangeComponent;
  let fixture: ComponentFixture<ProfileEmailChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileEmailChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEmailChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
