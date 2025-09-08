import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageShowComponent } from './message-show.component';

describe('MessageShowComponent', () => {
  let component: MessageShowComponent;
  let fixture: ComponentFixture<MessageShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
