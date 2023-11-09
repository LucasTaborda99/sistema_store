import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControleEstoqueService } from 'src/app/services/controle-estoque.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {

  onAddControleEstoque = new EventEmitter()
  onEditarControleEstoque = new EventEmitter()
  controleEstoqueForm: any = FormGroup
  dialogAcao: any = "Adicionar";
  action: any = "Adicionar"
  mensagemResposta: any
  categorias: any = []
  produtos: any = []
  controleEstoque: any = []

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private controleEstoqueService: ControleEstoqueService,
  public dialogRef: MatDialogRef<EstoqueComponent>,
  private produtoService: ProductService,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.controleEstoqueForm = this.formBuilder.group({
      nome_produto: [null, [Validators.required, Validators.pattern(GlobalConstants.nomeRegex)]],
      quantidade_minima: [null, Validators.required],
      quantidade_maxima: [null, Validators.required],
    })

    if(this.dialogData.action === 'Editar') {
      this.dialogAcao = "Editar"
      this.action = "Atualizar"
      this.controleEstoqueForm.patchValue(this.dialogData.data)
    };

    // Buscando a lista de produtos
    this.produtoService.get().subscribe((produtos: any) => {
      console.log(produtos)
      this.produtos = produtos;
    });
}


  submit() {
    if(this.dialogAcao === 'Editar') {
      this.editar()
    } else {
      this.adicionar()
    }
  }

  adicionar() {
    let formData = this.controleEstoqueForm.value
    let data = {
      nome_produto: formData.nome_produto,
      quantidade_minima: formData.quantidade_minima,
      quantidade_maxima: formData.quantidade_maxima
    }
    console.log(data)
    this.controleEstoqueService.adicionar(data).subscribe((response: any) => {
    this.dialogRef.close();
    this.onAddControleEstoque.emit()
    this.mensagemResposta = response.message
    this.snackbarService.openSnackBar(this.mensagemResposta, "success")
    }, (error: any) => {
      console.log('Erro:', error);
      this.dialogRef.close()
      if(error.error?.message) {
        this.mensagemResposta = error.error?.message
      } else {
        this.mensagemResposta = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.mensagemResposta, GlobalConstants.error)
    })
  }

  editar() {
    let formData = this.controleEstoqueForm.value
    let data = {
      nome_produto: formData.nome_produto,
      quantidade_minima: formData.quantidade_minima,
      quantidade_maxima: formData.quantidade_maxima
    }
    this.controleEstoqueService.update(data).subscribe((response: any) => {
    this.dialogRef.close()
    this.onEditarControleEstoque.emit()
    this.mensagemResposta = response.message
    this.snackbarService.openSnackBar(this.mensagemResposta, "success")
    }, (error: any) => {
      this.dialogRef.close()
      if(error.error?.message) {
        this.mensagemResposta = error.error?.message
      } else {
        this.mensagemResposta = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.mensagemResposta, GlobalConstants.error)
    })
  }

}
