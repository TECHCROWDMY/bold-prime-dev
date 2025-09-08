import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactManagerAdminComponent } from './contact-manager-admin.component';

describe('ContactManagerAdminComponent', () => {
  let component: ContactManagerAdminComponent;
  let fixture: ComponentFixture<ContactManagerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactManagerAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactManagerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
