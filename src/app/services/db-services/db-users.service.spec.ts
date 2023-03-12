import { TestBed } from '@angular/core/testing';

import { DbUsersService } from './db-users.service';

describe('DbUsersService', () => {
  let service: DbUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
