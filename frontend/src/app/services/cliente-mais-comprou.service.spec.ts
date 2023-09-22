import { TestBed } from '@angular/core/testing';

import { ClienteMaisComprouService } from './cliente-mais-comprou.service';

describe('ClienteMaisComprouService', () => {
  let service: ClienteMaisComprouService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteMaisComprouService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
