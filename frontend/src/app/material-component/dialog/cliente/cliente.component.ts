import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientesService } from 'src/app/services/clientes.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  onAddCliente = new EventEmitter()
  onEditarCliente = new EventEmitter()
  clienteForm: any = FormGroup
  dialogAcao: any = "Adicionar";
  action: any = "Adicionar"
  mensagemResposta: any
  categorias: any = []

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private clientesService: ClientesService,
  public dialogRef: MatDialogRef<ClienteComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.clienteForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.pattern(GlobalConstants.nomeRegex)]],
      endereco: [null, Validators.required],
      telefone: [null, Validators.required],
      email: [null, Validators.required],
      cpf: [null, Validators.required]
    })

    if(this.dialogData.action === 'Editar') {
      this.dialogAcao = "Editar"
      this.action = "Atualizar"
      this.clienteForm.patchValue(this.dialogData.data)
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
    let formData = this.clienteForm.value
    let data = {
      nome: formData.nome,
      endereco: formData.endereco,
      telefone: formData.telefone,
      email: formData.email,
      cpf: formData.cpf
    }
    console.log(data)
    this.clientesService.adicionar(data).subscribe((response: any) => {
    this.dialogRef.close();
    this.onAddCliente.emit()
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
    let formData = this.clienteForm.value
    let data = {
      id: this.dialogData.data.id,
      nome: formData.nome,
      endereco: formData.endereco,
      telefone: formData.telefone,
      email: formData.email,
      cpf: formData.cpf
    }
    this.clientesService.update(data).subscribe((response: any) => {
    this.dialogRef.close()
    this.onEditarCliente.emit()
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
