import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mb4WebTraderComponent } from './mb4-web-trader.component';

describe('Mb4WebTraderComponent', () => {
  let component: Mb4WebTraderComponent;
  let fixture: ComponentFixture<Mb4WebTraderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mb4WebTraderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mb4WebTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
