import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerGetCodeComponent } from './banner-get-code.component';

describe('BannerGetCodeComponent', () => {
  let component: BannerGetCodeComponent;
  let fixture: ComponentFixture<BannerGetCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerGetCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerGetCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
