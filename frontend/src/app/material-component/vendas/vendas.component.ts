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
    produto_nome: '',
    preco_unitario: 0,
    quantidade_vendida: 0,
    desconto_aplicado: 0,
    cliente_nome: '',
    total_venda: 0
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

      // Verificando se o campo é a quantidade vendida e se o valor é igual a 0
      if (inputElement.id === 'quantidade_vendida' && parsedValue === 0) {

      // Informando ao usuário que a quantidade vendida deve ser maior que 0
      this.responseMessage = "A quantidade vendida deve ser maior que 0.";
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      // Saindo da função se a quantidade vendida for igual a 0
      return;
    }
  }
    // Log para verificar o valor após a verificação
    console.log('Valor após a verificação:', inputElement.value);
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

    // Verifique se os campos nome_produto e nome_cliente não são nulos
    if (!this.venda.produto_nome || !this.venda.cliente_nome) {
      this.responseMessage = "Os campos 'Nome do Produto' e 'Nome do Cliente' são obrigatórios.";
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      // Saindo da função se os campos forem nulos
      return;
    }

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
          this.responseMessage = "Produto ou Cliente não encontrado";
        } else if (error.status === 400) {
          this.responseMessage = "Quantidade insuficiente em estoque";
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

}
