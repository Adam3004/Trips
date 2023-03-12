import { TestBed } from '@angular/core/testing';

import { DbTripsService } from './db-trips.service';

describe('DbTripsService', () => {
  let service: DbTripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbTripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
