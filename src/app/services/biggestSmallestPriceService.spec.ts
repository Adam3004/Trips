import { TestBed } from '@angular/core/testing';

import { BiggestSmallestPriceService } from './biggestSmallestPriceService.service';

describe('BiggestSmallestPriceService', () => {
  let service: BiggestSmallestPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiggestSmallestPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
