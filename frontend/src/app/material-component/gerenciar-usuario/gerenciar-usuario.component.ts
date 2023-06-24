import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-gerenciar-usuario',
  templateUrl: './gerenciar-usuario.component.html',
  styleUrls: ['./gerenciar-usuario.component.scss']
})
export class GerenciarUsuarioComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'email', 'numero_contato', 'status']
  dataSource: any
  responseMessage: any

  constructor(private userService: UserService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.tableData()
  }

  tableData() {
    this.userService.getUsuario().subscribe((response: any) => {
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

  changeStatusERoleUsuarios(status: any, id: any) {
    let data = {
      status: status.toString(),
      id: id
    }
    this.userService.updateUsuarioStatusERole(data).subscribe((response: any) => {
      this.responseMessage = response?.message
      this.snackbarService.openSnackBar(this.responseMessage, "Success")
    }, (error: any) => {
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
        console.log(error)
      } else {
        this.responseMessage = GlobalConstants.genericError;
        console.log(error)
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
}
