import { TestBed } from '@angular/core/testing';

import { DbBasketService } from './db-boughtTrips.service';

describe('DbBasketService', () => {
  let service: DbBasketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbBasketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
