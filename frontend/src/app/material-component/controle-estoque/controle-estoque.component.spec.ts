import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleEstoqueComponent } from './controle-estoque.component';

describe('ControleEstoqueComponent', () => {
  let component: ControleEstoqueComponent;
  let fixture: ComponentFixture<ControleEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControleEstoqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
