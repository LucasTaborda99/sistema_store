import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteMaisComprouComponent } from './cliente-mais-comprou.component';

describe('ClienteMaisComprouComponent', () => {
  let component: ClienteMaisComprouComponent;
  let fixture: ComponentFixture<ClienteMaisComprouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteMaisComprouComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteMaisComprouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
