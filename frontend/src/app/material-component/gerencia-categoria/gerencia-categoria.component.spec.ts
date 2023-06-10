import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaCategoriaComponent } from './gerencia-categoria.component';

describe('GerenciaCategoriaComponent', () => {
  let component: GerenciaCategoriaComponent;
  let fixture: ComponentFixture<GerenciaCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciaCategoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
