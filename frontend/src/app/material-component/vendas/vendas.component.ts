import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { VendasService } from 'src/app/services/vendas.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  venda = {
    produto_id: null,
    quantidade_vendida: null
  }

  // displayedColumns: string[] = ['nome', 'email', 'numero_contato', 'status', 'role']
  dataSource: any
  // responseMessage: any

  constructor(private vendasService: VendasService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
  //   this.tableData()
  }

  // tableData() {
  //   this.vendasService.get().subscribe((response: any) => {
  //     this.dataSource = new MatTableDataSource(response);
  //     console.log(response)
  //   }, (error: any) => {
  //     if(error.error?.message) {
  //       this.responseMessage = error.error?.message;
  //     } else {
  //       this.responseMessage = GlobalConstants.genericError;
  //     }
  //     this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
  //   })
  // }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value
    
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const valorColunaNome = data.id.toLowerCase()
      return valorColunaNome.includes(filter)
    }
    this.dataSource.filter = valorFiltro.trim().toLowerCase()
  }

  registrarVenda() {
    this.vendasService.registrar(this.venda).subscribe(
      (response) => {
        console.log('Venda registrada com sucesso', response);

        // Limpa os campos após o registro da venda
        this.venda.produto_id = null;
        this.venda.quantidade_vendida = null;
      },
      (error) => {
        console.error('Erro ao registrar a venda', error);
      }
    );
  }

}
