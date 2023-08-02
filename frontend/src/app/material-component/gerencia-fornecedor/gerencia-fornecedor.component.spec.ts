import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaFornecedorComponent } from './gerencia-fornecedor.component';

describe('GerenciaFornecedorComponent', () => {
  let component: GerenciaFornecedorComponent;
  let fixture: ComponentFixture<GerenciaFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciaFornecedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciaFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
