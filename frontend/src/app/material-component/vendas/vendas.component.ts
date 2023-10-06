import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { VendasService } from 'src/app/services/vendas.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  vendaForm: FormGroup;

  venda = {
    produto_nome: null,
    preco_unitario: null,
    quantidade_vendida: null,
    desconto_aplicado: null,
    cliente_nome: null,
    total_venda: 0  // Inicialize o total_venda com 0
  }

  dataSource: any
  responseMessage: any

  constructor(
    private vendasService: VendasService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.vendaForm = this.formBuilder.group({
      produto_nome: [null, Validators.required],
      preco_unitario: [0, [Validators.pattern('^[0-9]*\.?[0-9]*$')]],
      quantidade_vendida: [0, [Validators.pattern('^[0-9]*$')]],
      desconto_aplicado: [0, [Validators.pattern('^[0-9]*$')]],
      cliente_nome: [null, Validators.required],
      total_venda: []
    });
  }

    // Função de validação personalizada para evitar números negativos
    noNegativeValues(control: AbstractControl): { [key: string]: any } | null {
      if (control.value < 0) {
        return { 'negativeValue': true };
      }
      return null;
    }

  ngOnInit(): void {
    this.tableData();
  }

  tableData() {
    this.vendasService.get().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      console.log(response);
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  calcularValorTotalVenda(): void {
    const precoUnitario = this.vendaForm.get('preco_unitario')?.value || 0;
    const quantidadeVendida = this.vendaForm.get('quantidade_vendida')?.value || 0;
    const descontoAplicado = this.vendaForm.get('desconto_aplicado')?.value || 0;

    const totalVenda = (precoUnitario * quantidadeVendida) - descontoAplicado;

    // Atualize o valor no FormGroup
    this.vendaForm.patchValue({ total_venda: totalVenda.toFixed(2) });

    // Atualize o objeto venda
    this.venda.total_venda = totalVenda;
  }

  updateTotalValue(): void {
    this.calcularValorTotalVenda();
  }

  registrarVenda() {
    // Verifique se o formulário é válido
    if (this.vendaForm.invalid) {
      this.snackbarService.openSnackBar("Preencha todos os campos.", GlobalConstants.error);
      return;
    }

    // Chame o método para calcular o valor total da venda
    this.calcularValorTotalVenda();

    this.vendasService.registrar(this.vendaForm.value).subscribe(
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

    // Função para prevenir caracteres inválidos
    preventInvalidCharacters(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement && inputElement.value) {
        // Remove todos os caracteres que não são dígitos (0-9) ou o ponto decimal (.)
        inputElement.value = inputElement.value.replace(/[^0-9.]/g, '');
  
        // Garanta que há apenas um ponto decimal no valor (evite múltiplos pontos)
        inputElement.value = inputElement.value.replace(/(\..*)\./g, '$1');
  
        // Verifique se o valor é válido e não é "NaN"
        const parsedValue = parseFloat(inputElement.value);
        if (isNaN(parsedValue)) {
          inputElement.value = '0'; // Defina como zero se for inválido
        } else {
          inputElement.value = parsedValue.toString(); // Formate o valor corretamente
        }
      }
    }
}