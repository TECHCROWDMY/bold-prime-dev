import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCommissionComponent } from './client-commission.component';

describe('ClientCommissionComponent', () => {
  let component: ClientCommissionComponent;
  let fixture: ComponentFixture<ClientCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCommissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
