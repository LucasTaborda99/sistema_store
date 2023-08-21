import { TestBed } from '@angular/core/testing';

import { ControleEstoqueService } from './controle-estoque.service';

describe('ControleEstoqueService', () => {
  let service: ControleEstoqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControleEstoqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
