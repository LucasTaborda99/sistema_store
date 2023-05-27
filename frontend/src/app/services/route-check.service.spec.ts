import { TestBed } from '@angular/core/testing';

import { RouteCheckService } from './route-check.service';

describe('RouteCheckService', () => {
  let service: RouteCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
