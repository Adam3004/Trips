import { TestBed } from '@angular/core/testing';

import { FilterTripsService } from './filter-trips.service';

describe('FilterTripsService', () => {
  let service: FilterTripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterTripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
