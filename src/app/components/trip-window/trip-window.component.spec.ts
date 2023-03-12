import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripWindowComponent } from './trip-window.component';

describe('TripWindowComponent', () => {
  let component: TripWindowComponent;
  let fixture: ComponentFixture<TripWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
