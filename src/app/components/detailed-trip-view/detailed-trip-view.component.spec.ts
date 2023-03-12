import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedTripViewComponent } from './detailed-trip-view.component';

describe('DetailedTripViewComponent', () => {
  let component: DetailedTripViewComponent;
  let fixture: ComponentFixture<DetailedTripViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedTripViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedTripViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
