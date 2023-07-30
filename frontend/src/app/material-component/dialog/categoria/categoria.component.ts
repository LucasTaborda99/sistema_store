import { Component, Inject, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {
  onAdicionarCategoria = new EventEmitter();
  onEditarCategoria = new EventEmitter();
  formCategoria: any = FormGroup;
  dialogAcao: any = "Adicionar";
  action: any = "Adicionar";
  mensagemResposta: any;
  onEditarProduto: any;

  constructor(@Inject(MAT_DIALOG_DATA)
  public dialogData: any,
  private formBuilder: FormBuilder,
  private categoriaService: CategoriaService,
  public dialogRef: MatDialogRef<CategoriaComponent>,
  private snackBarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.formCategoria = this.formBuilder.group({
      nome: [null, [Validators.required]]
    })
    if(this.dialogData.action === 'Editar'){
      this.dialogAcao = 'Editar'
      this.action = 'Atualizar'
      this.formCategoria.patchValue(this.dialogData.data)
    }
  }

  submit() {
    if(this.dialogAcao === 'Editar') {
      this.editar()
    } else {
      this.adicionar()
    }
  }

  adicionar() {
    let formData = this.formCategoria.value
    let data = {
      nome: formData.nome
    }
    console.log(data)
    this.categoriaService.adicionar(data).subscribe((response: any) => {
    this.dialogRef.close();
    this.onAdicionarCategoria.emit()
    this.mensagemResposta = response.message
    this.snackBarService.openSnackBar(this.mensagemResposta, "success")
    }, (error: any) => {
      console.log('Erro:', error);
      this.dialogRef.close()
      if(error.error?.message) {
        this.mensagemResposta = error.error?.message
      } else {
        this.mensagemResposta = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.mensagemResposta, GlobalConstants.error)
    })
  }

  editar() {
    let formData = this.formCategoria.value
    let data = {
      id: this.dialogData.data.id,
      nome: formData.nome
    }
    this.categoriaService.update(data).subscribe((response: any) => {
    this.dialogRef.close()
    this.onEditarCategoria.emit()
    this.mensagemResposta = response.message
    this.snackBarService.openSnackBar(this.mensagemResposta, "success")
    }, (error: any) => {
      this.dialogRef.close()
      if(error.error?.message) {
        this.mensagemResposta = error.error?.message
      } else {
        this.mensagemResposta = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.mensagemResposta, GlobalConstants.error)
    })
  }

}
