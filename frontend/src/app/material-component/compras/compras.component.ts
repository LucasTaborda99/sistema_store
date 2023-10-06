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
    produto_nome: '',
    preco_unitario: 0,
    quantidade_comprada: 0,
    desconto_recebido: 0,
    fornecedor_nome: '',
    total_compra: 0
  }

  preventInvalidCharacters(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value) {
      // Remova todos os caracteres que não são dígitos (0-9) ou o ponto decimal (.)
      inputElement.value = inputElement.value.replace(/[^0-9.]/g, '');
  
      // Garantindo que há apenas um ponto decimal no valor (evite múltiplos pontos)
      inputElement.value = inputElement.value.replace(/(\..*)\./g, '$1');
  
      // Verificando se o campo é nulo ou contém apenas um ponto decimal e defina o valor como '0'
      if (inputElement.value === '' || inputElement.value === '.') {
        inputElement.value = '0';
      }

      // Verificando se o valor é válido e não é "NaN"
      const parsedValue = parseFloat(inputElement.value);
      if (isNaN(parsedValue)) {
        inputElement.value = '0'; // Defina como zero se for inválido
      } else {
        inputElement.value = parsedValue.toString(); // Formate o valor corretamente
      }

      // Verificando se o campo é a quantidade comprada e se o valor é igual a 0
      if (inputElement.id === 'quantidade_comprada' && parsedValue === 0) {

      // Informando ao usuário que a quantidade comprada deve ser maior que 0
      this.responseMessage = "A quantidade comprada deve ser maior que 0.";
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      // Saindo da função se a quantidade comprada for igual a 0
      return;
    }
  
      // Log para verificar o valor após a verificação
      console.log('Valor após a verificação:', inputElement.value);
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

      // Verifique se os campos nome_produto e nome_fornecedor não são nulos
      if (!this.compra.produto_nome || !this.compra.fornecedor_nome) {
        this.responseMessage = "Os campos 'Nome do Produto' e 'Nome do Fornecedor' são obrigatórios.";
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        // Saindo da função se os campos forem nulos
        return;
      }
  
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
            this.responseMessage = "'Quantidade Comprada' deve ser maior do que 0";
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        }
      );
    }

}
