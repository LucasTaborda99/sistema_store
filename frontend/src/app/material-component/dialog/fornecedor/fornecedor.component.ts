import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent implements OnInit {

  onAddFornecedor = new EventEmitter()
  onEditarFornecedor = new EventEmitter()
  fornecedorForm: any = FormGroup
  dialogAcao: any = "Adicionar";
  action: any = "Adicionar"
  mensagemResposta: any
  categorias: any = []

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private fornecedorService: FornecedorService,
  public dialogRef: MatDialogRef<FornecedorComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.fornecedorForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.pattern(GlobalConstants.nomeRegex)]],
      endereco: [null, Validators.required],
      telefone: [null, Validators.required],
      cnpj: [null, Validators.required],
    })

    if(this.dialogData.action === 'Editar') {
      this.dialogAcao = "Editar"
      this.action = "Atualizar"
      this.fornecedorForm.patchValue(this.dialogData.data)
    }
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
      // Converte toda a string para letras minúsculas.
      .toLowerCase()
      // Remove espaços em branco no início e no final da string.
      .trim();
  }

  adicionar() {
    let formData = this.fornecedorForm.value
    let nomeFornecedor = this.removerAcentosECaracteresEspeciais(formData.nome)
    let data = {
      nome: nomeFornecedor,
      endereco: formData.endereco,
      telefone: formData.telefone,
      cnpj: formData.cnpj
    }
    console.log(data)
    this.fornecedorService.adicionar(data).subscribe((response: any) => {
    this.dialogRef.close();
    this.onAddFornecedor.emit()
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
    let formData = this.fornecedorForm.value
    let nomeFornecedor = this.removerAcentosECaracteresEspeciais(formData.nome)
    let data = {
      id: this.dialogData.data.id,
      nome: nomeFornecedor,
      endereco: formData.endereco,
      telefone: formData.telefone,
      cnpj: formData.cnpj
    }
    this.fornecedorService.update(data).subscribe((response: any) => {
    this.dialogRef.close()
    this.onEditarFornecedor.emit()
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
