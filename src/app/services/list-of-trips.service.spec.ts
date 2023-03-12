import { TestBed } from '@angular/core/testing';

import { ListOfTripsService } from './list-of-trips.service';

describe('ListOfTripsService', () => {
  let service: ListOfTripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListOfTripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
