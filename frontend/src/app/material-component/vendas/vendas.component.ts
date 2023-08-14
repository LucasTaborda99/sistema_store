import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { VendasService } from 'src/app/services/vendas.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  venda = {
    produto_id: null,
    preco_unitario: null,
    quantidade_vendida: null,
    desconto_aplicado: null,
    cliente_id: null,
    total_venda: 0
  }

  // Método para não aceitar números negativos
  preventNegativeNumbers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value) {
      const value = parseInt(inputElement.value, 10);
      if (value < 0) {
        inputElement.value = '0';
      }
    }
  }

  dataSource: any
  responseMessage: any

  constructor(private vendasService: VendasService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
     this.tableData()
  }

  tableData() {
    this.vendasService.get().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      console.log(response)
    }, (error: any) => {
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

  calcularValorTotalVenda(): void {
    const precoUnitario = this.venda.preco_unitario || 0;
    const quantidadeVendida = this.venda.quantidade_vendida || 0;
    const descontoAplicado = this.venda.desconto_aplicado || 0;

    this.venda.total_venda = (precoUnitario * quantidadeVendida) - descontoAplicado;
  }

  updateTotalValue(): void {
    this.calcularValorTotalVenda();
  }

  registrarVenda() {
    this.calcularValorTotalVenda()

    this.vendasService.registrar(this.venda).subscribe(
      (response: any) => {
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.responseMessage = "Apenas administradores têm permissão para deletar as vendas";
        } else if (error.status === 404) {
          this.responseMessage = "Produto não encontrado";
        } else if (error.status === 400) {
          this.responseMessage = "Quantidade insuficiente em estoque ou campo 'ID do Produto' e 'Quantidade Vendida' devem ser maiores do que 0";
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

}
