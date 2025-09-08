import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkManageComponent } from './link-manage.component';

describe('LinkManageComponent', () => {
  let component: LinkManageComponent;
  let fixture: ComponentFixture<LinkManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
