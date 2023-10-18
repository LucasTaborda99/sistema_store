import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ComprasService } from 'src/app/services/compras.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { FornecedorService } from 'src/app/services/fornecedor.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  compraForm: FormGroup;
  fornecedores: any[] | undefined;

  compra = {
    produto_nome: null,
    preco_unitario: null,
    quantidade_comprada: null,
    desconto_recebido: null,
    fornecedor_nome: null,
    total_compra: ''
  }

  dataSource: any
  responseMessage: any

  constructor(
    private comprasService: ComprasService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private fornecedoresService: FornecedorService
  ) { 
    this.compraForm = this.formBuilder.group({
      produto_nome: [null, Validators.required],
      preco_unitario: [0, [Validators.pattern('^[0-9]*$'), this.noNegativeValues]],
      quantidade_comprada: [0, [Validators.pattern('^[0-9]*$'), this.noNegativeValues]],
      desconto_recebido: [0, [Validators.pattern('^[0-9]*$'), this.noNegativeValues]],
      fornecedor_nome: [null, Validators.required],
      total_compra: []

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
    this.tableData()

    // Buscando a lista de fornecedores
    this.fornecedoresService.get().subscribe((fornecedores: any) => {
      this.fornecedores = fornecedores;
    });

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
    const precoUnitario = this.compraForm.get('preco_unitario')?.value || 0;
    const quantidadeComprada = this.compraForm.get('quantidade_comprada')?.value || 0;
    const descontoRecebido = this.compraForm.get('desconto_recebido')?.value || 0;
  
    const totalCompra = (precoUnitario * quantidadeComprada) - descontoRecebido;
  
    // Atualizando o valor do FormControl 'total_compra'
    this.compraForm.patchValue({ total_compra: totalCompra.toFixed(2) });

    // Atualizando o objeto compra com o total calculado
    this.compra.total_compra = totalCompra.toString();
  }
  
  updateTotalValue(): void {
    this.calcularValorTotalCompra();
  }

  registrarCompra() {
    // Verifique se o formulário é válido
    if (this.compraForm.invalid) {
      this.snackbarService.openSnackBar("Preencha todos os campos.", GlobalConstants.error);
      return;
    }

      // Chame o método para calcular o valor total da compra
  this.calcularValorTotalCompra();

    const precoUnitarioControl = this.compraForm.get('preco_unitario');
    const quantidadeCompradaControl = this.compraForm.get('quantidade_comprada');
    const descontoRecebidoControl = this.compraForm.get('desconto_recebido');
    
    const precoUnitario = precoUnitarioControl?.value || 0;
    const quantidadeComprada = quantidadeCompradaControl?.value || 0;
    const descontoRecebido = descontoRecebidoControl?.value || 0;

    console.log('precoUnitario:', precoUnitario);
    console.log('quantidadeComprada:', quantidadeComprada);
    console.log('descontoRecebido:', descontoRecebido);
    
    const totalCompra = (precoUnitario * quantidadeComprada) - descontoRecebido;
    console.log('totalCompra:', totalCompra);

    // Atualizando o valor do FormControl 'total_compra'
    this.compraForm.patchValue({ total_compra: totalCompra.toFixed(2) });

  // Atualizando o objeto compra com o total calculado
  this.compra.total_compra = totalCompra.toString();
  
    this.comprasService.registrar(this.compraForm.value).subscribe(
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