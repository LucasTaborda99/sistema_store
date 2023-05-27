import { TestBed } from '@angular/core/testing';

import { TokenInterceptadorInterceptor } from './token-interceptador.interceptor';

describe('TokenInterceptadorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenInterceptadorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenInterceptadorInterceptor = TestBed.inject(TokenInterceptadorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
