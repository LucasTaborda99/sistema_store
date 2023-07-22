import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarProdutoComponent } from './gerenciar-produto.component';

describe('GerenciarProdutoComponent', () => {
  let component: GerenciarProdutoComponent;
  let fixture: ComponentFixture<GerenciarProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciarProdutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
