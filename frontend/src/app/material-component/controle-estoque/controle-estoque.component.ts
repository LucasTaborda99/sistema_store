import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { EstoqueComponent } from '../dialog/estoque/estoque.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ControleEstoqueService } from 'src/app/services/controle-estoque.service';

@Component({
  selector: 'app-controle-estoque',
  templateUrl: './controle-estoque.component.html',
  styleUrls: ['./controle-estoque.component.scss']
})
export class ControleEstoqueComponent implements OnInit {

  displayedColumns: string[] = ['id', 'produto_id', 'quantidade_minima', 'quantidade_maxima', 'editar']
  dataSource: any
  responseMessage: any

  constructor(private controleEstoqueService: ControleEstoqueService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.tableData()
  }

  tableData() {
    this.controleEstoqueService.get().subscribe((response: any) => {
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
      const valorColunaNome = data.produto_id.toLowerCase()
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
    const dialogRef = this.dialog.open(EstoqueComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onAddControleEstoque.subscribe(
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
    const dialogRef = this.dialog.open(EstoqueComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onEditarControleEstoque.subscribe(
      (response) => {
        this.tableData()
      }
    )
  }

  handleDeletarAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'deletar ' + ' o controle de estoque ' + '"' + values.produto_id + '"'
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    const sub = dialogRef.componentInstance.emitirMudancaStatus.subscribe((response) => {
      this.deletarControleEstoque(values.id)
      dialogRef.close()
    })
  }

  deletarControleEstoque(id: any) {
    this.controleEstoqueService.delete(id).subscribe(
      (response: any) => {
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.responseMessage = "Apenas administradores têm permissão para deletar os controles de estoque";
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
