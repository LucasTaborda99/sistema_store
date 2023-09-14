import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoriaComponent } from '../dialog/categoria/categoria.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gerencia-categoria',
  templateUrl: './gerencia-categoria.component.html',
  styleUrls: ['./gerencia-categoria.component.scss']
})
export class GerenciaCategoriaComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'editar']
  dataSource: any
  responseMessage: any

  constructor(private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.tableData()
  }

  tableData() {
    this.categoriaService.getCategoria().subscribe((response: any) => {
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
    this.dataSource.filter = valorFiltro.trim().toLowerCase()
  }

  adicionarAction() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Adicionar'
    }
    dialogConfig.width = '850px'
    const dialogRef = this.dialog.open(CategoriaComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onAdicionarCategoria.subscribe(
      (response) => {
        this.tableData()
      }
    )
  }

  editaAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Editar',
      data: values
    }
    dialogConfig.width = '850px'
    const dialogRef = this.dialog.open(CategoriaComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onEditarCategoria.subscribe(
      (response) => {
        this.tableData()
      }
    )
  }

  handleDeletarAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'deletar ' + ' a categoria ' + '"' + values.nome + '"'
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    const sub = dialogRef.componentInstance.emitirMudancaStatus.subscribe((response) => {
      this.deletarCategoria(values.id)
      dialogRef.close()
    })
  }

  deletarCategoria(id: any) {
    this.categoriaService.delete(id).subscribe(
      (response: any) => {
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.responseMessage = "Apenas administradores têm permissão para deletar categorias";
        } else if (error.status === 404) {
          this.responseMessage = "ID não encontrado";
        } else if (error.status === 400) {
          this.responseMessage = "Não é possível excluir a categoria, pois existem produtos associados a ela";
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

}
