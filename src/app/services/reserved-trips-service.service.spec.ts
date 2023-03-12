import { TestBed } from '@angular/core/testing';

import { ReservedTripsServiceService } from './reserved-trips-service.service';

describe('ReservedTripsServiceService', () => {
  let service: ReservedTripsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservedTripsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
