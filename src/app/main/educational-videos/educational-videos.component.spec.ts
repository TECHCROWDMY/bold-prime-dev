import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalVideosComponent } from './educational-videos.component';

describe('EducationalVideosComponent', () => {
  let component: EducationalVideosComponent;
  let fixture: ComponentFixture<EducationalVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
