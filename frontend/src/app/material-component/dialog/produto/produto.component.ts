import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  onAddProduto = new EventEmitter()
  onEditarProduto = new EventEmitter()
  produtoForm: any = FormGroup
  dialogAcao: any = "Adicionar";
  action: any = "Adicionar"
  mensagemResposta: any
  categorias: any = []

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private productService: ProductService,
  public dialogRef: MatDialogRef<ProdutoComponent>,
  private categoriaService: CategoriaService,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.produtoForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.pattern(GlobalConstants.nomeRegex)]],
      preco: [null, Validators.required],
      descricao: [null, Validators.required],
      quantidade: [null, Validators.required],
      nome_categoria: [null, [Validators.required, Validators.pattern(GlobalConstants.nomeRegex)]]
    })

    if(this.dialogData.action === 'Editar') {
      this.dialogAcao = "Editar"
      this.action = "Atualizar"
      this.produtoForm.patchValue(this.dialogData.data)
    }
    this.getCategorias()

    // Buscando a lista de produtos
    this.categoriaService.getCategoria().subscribe((categorias: any) => {
      this.categorias = categorias;
    });
  }

  getCategorias() {
    this.categoriaService.getCategoria().subscribe((response: any) => {
      this.categorias = response
    }, (error: any) => {
      if(error.error?.message) {
        this.mensagemResposta = error.error?.message
      } else {
        this.mensagemResposta = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.mensagemResposta, GlobalConstants.error)
    })
  }

  submit() {
    if(this.dialogAcao === 'Editar') {
      this.editar()
    } else {
      this.adicionar()
    }
  }

  removerAcentosECaracteresEspeciais(input: string): string {
    // Normaliza a string para sua forma de composição (NFD), permitindo que caracteres acentuados sejam tratados separadamente.
    return input
      .normalize('NFD')
      // Remove os caracteres acentuados da string, mantendo apenas suas formas não acentuadas.
      .replace(/[\u0300-\u036f]/g, '')
      // Remove todos os caracteres que não são letras (maiúsculas ou minúsculas) ou números e também não são espaços em branco.
      .replace(/[^a-zA-Z0-9 ]/g, '')
      // Converte toda a string para letras maiúsculas.
      .toUpperCase()
      // Remove espaços em branco no meio da string.
      .replace(/\s+/g, ' ')
      // Remove espaços em branco no início e no final da string.
      .trim();
  }

  adicionar() {
    let formData = this.produtoForm.value
    let nomeProduto = this.removerAcentosECaracteresEspeciais(formData.nome)
    let data = {
      nome: nomeProduto,
      preco: formData.preco,
      descricao: formData.descricao,
      quantidade: formData.quantidade,
      nome_categoria: formData.nome_categoria
    }
    console.log(data)
    this.productService.adicionar(data).subscribe((response: any) => {
    this.dialogRef.close();
    this.onAddProduto.emit()
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
    let formData = this.produtoForm.value
    let nomeProduto = this.removerAcentosECaracteresEspeciais(formData.nome)
    let data = {
      id: this.dialogData.data.id,
      nome: nomeProduto,
      preco: formData.preco,
      descricao: formData.descricao,
      quantidade: formData.quantidade,
      nome_categoria: formData.nome_categoria
    }
    this.productService.update(data).subscribe((response: any) => {
    this.dialogRef.close()
    this.onEditarProduto.emit()
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
