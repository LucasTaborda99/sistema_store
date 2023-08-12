import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteComponent } from '../dialog/cliente/cliente.component';

@Component({
  selector: 'app-gerenciar-clientes',
  templateUrl: './gerenciar-clientes.component.html',
  styleUrls: ['./gerenciar-clientes.component.scss']
})
export class GerenciarClientesComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'endereco', 'telefone', 'email', 'cpf', 'id', 'editar']
  dataSource: any
  responseMessage: any

  constructor(private clientesService: ClientesService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

    ngOnInit(): void {
      this.tableData()
    }

    tableData() {
      this.clientesService.get().subscribe((response: any) => {
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

    aplicarFiltro(event: Event) {
      const valorFiltro = (event.target as HTMLInputElement).value
      
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const valorColunaNome = data.nome.toLowerCase()
        return valorColunaNome.includes(filter)
      }
      this.dataSource.filter = valorFiltro.trim().toLowerCase()
    }
  
    adicionarAction() {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        action: 'Adicionar'
      }
      dialogConfig.width = '850px'
      const dialogRef = this.dialog.open(ClienteComponent, dialogConfig)
      this.router.events.subscribe(() => {
        dialogRef.close()
      })
      const sub = dialogRef.componentInstance.onAddCliente.subscribe(
        (response) => {
          this.tableData()
        }
      )
    }
  
    editarAction(values: any) {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        action: 'Editar',
        data: values
      }
      dialogConfig.width = '850px'
      const dialogRef = this.dialog.open(ClienteComponent, dialogConfig)
      this.router.events.subscribe(() => {
        dialogRef.close()
      })
      const sub = dialogRef.componentInstance.onEditarCliente.subscribe(
        (response) => {
          this.tableData()
        }
      )
    }
  
    handleDeletarAction(values: any) {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        message: 'deletar ' + ' o cliente ' + '"' + values.nome + '"'
      }
      const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
      const sub = dialogRef.componentInstance.emitirMudancaStatus.subscribe((response) => {
        this.deletarCliente(values.id)
        dialogRef.close()
      })
    }
  
    deletarCliente(id: any) {
      this.clientesService.delete(id).subscribe(
        (response: any) => {
          this.tableData();
          this.responseMessage = response?.message;
          this.snackbarService.openSnackBar(this.responseMessage, "success");
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.responseMessage = "Apenas administradores têm permissão para deletar clientes";
          } else if (error.status === 404) {
            this.responseMessage = "ID não encontrado";
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        }
      );
    }

}
