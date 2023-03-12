import { TestBed } from '@angular/core/testing';

import { BoughtTripsService } from './bought-trips.service';

describe('BoughtTripsService', () => {
  let service: BoughtTripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoughtTripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
