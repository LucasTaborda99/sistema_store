import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ComprasService } from 'src/app/services/compras.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  compra = {
    produto_nome: null,
    preco_unitario: null,
    quantidade_comprada: null,
    desconto_recebido: null,
    fornecedor_nome: null,
    total_compra: 0
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

    constructor(private comprasService: ComprasService,
      private snackbarService: SnackbarService,
      private dialog: MatDialog,
      private router: Router) { }

    ngOnInit(): void {
      this.tableData()
    }

    tableData() {
      this.comprasService.get().subscribe((response: any) => {
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

    calcularValorTotalCompra(): void {
      const precoUnitario = this.compra.preco_unitario || 0;
      const quantidadeComprada = this.compra.quantidade_comprada || 0;
      const descontoRecebido = this.compra.desconto_recebido || 0;
  
      this.compra.total_compra = (precoUnitario * quantidadeComprada) - descontoRecebido;
    }

    updateTotalValue(): void {
      this.calcularValorTotalCompra();
    }

    registrarCompra() {
      this.calcularValorTotalCompra()
  
      this.comprasService.registrar(this.compra).subscribe(
        (response: any) => {
          this.tableData();
          this.responseMessage = response?.message;
          this.snackbarService.openSnackBar(this.responseMessage, "success");
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.responseMessage = "Apenas administradores têm permissão para deletar as compras";
          } else if (error.status === 404) {
            this.responseMessage = "Fornecedor não encontrado";
          } else if (error.status === 400) {
            this.responseMessage = "Quantidade insuficiente em estoque ou campo 'Nome do Produto' e 'Quantidade Comprada' devem ser maiores do que 0";
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        }
      );
    }

}
