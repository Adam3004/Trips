import { TestBed } from '@angular/core/testing';

import { DbRatingService } from './db-rating.service';

describe('DbRatingService', () => {
  let service: DbRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
