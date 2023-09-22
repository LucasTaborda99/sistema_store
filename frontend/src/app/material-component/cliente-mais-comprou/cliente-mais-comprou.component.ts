// cliente-mais-comprou.component.ts
import { Component, OnInit } from '@angular/core';
import { ClienteMaisComprouService } from '../../services/cliente-mais-comprou.service';

@Component({
  selector: 'app-cliente-mais-comprou',
  templateUrl: './cliente-mais-comprou.component.html',
  styleUrls: ['./cliente-mais-comprou.component.scss']
})
export class ClienteMaisComprouComponent implements OnInit {
  clienteMaisComprou: any;
  fornecedorMaisVendeu: any;

  constructor(private clienteMaisComprouService: ClienteMaisComprouService) { }

  ngOnInit(): void {
    this.clienteMaisComprouService.getClienteMaisComprou()
      .subscribe(
        (data) => {
          this.clienteMaisComprou = data;
        },
        (error) => {
          console.error('Erro:', error);
        }
      );
      this.clienteMaisComprouService.getFornecedorMaisCompras()
      .subscribe(
        (data) => {
          this.fornecedorMaisVendeu = data;
        },
        (error) => {
          console.error('Erro:', error);
        }
      );
  }
}