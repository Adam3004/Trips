import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWindowComponent } from './register-window.component';

describe('RegisterWindowComponent', () => {
  let component: RegisterWindowComponent;
  let fixture: ComponentFixture<RegisterWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
