import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProdutoComponent } from '../dialog/produto/produto.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-gerenciar-produto',
  templateUrl: './gerenciar-produto.component.html',
  styleUrls: ['./gerenciar-produto.component.scss']
})
export class GerenciarProdutoComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'nome_categoria', 'descricao', 'preco', 'quantidade', 'editar']
  dataSource: any
  responseMessage: any

    constructor(private productService: ProductService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.tableData()
  }

  tableData() {
    this.productService.get().subscribe((response: any) => {
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

  generatePDF() {

    // Criando uma instância do jsPDF
    const doc = new jsPDF();
  
    // Definindo as informações do relatório
    const columns = ['Nome', 'Descrição', 'Preço', 'Quantidade', 'Categoria'];
  
    // Obtendo os valores diretamente da tela
    const data = this.dataSource.data.map((element: any) => [
      element.nome,
      element.descricao,
      element.preco,
      element.quantidade,
      element.nome_categoria
    ]);
  
    doc.setFontSize(18);

		// Adicionando o título do relatório e definindo o alinhamento horizontal como 'center'
		doc.text('Relatório de Produtos - SistemaStore', 105, 10, { align: 'center' });
  
		// Cor azul em RGB para os cabeçalhos das colunas
		const blueColor = 'rgb(31, 158, 231)';

    // Cor preta em RGB para as linhas de separação das colunas
		const blackColor = 'rgb(128, 128, 128)';
  
    // Criando a tabela usando 'jspdf-autotable'
    autoTable(doc, {
      head: [columns],
      body: data,
      theme: 'grid',
      styles: {
        cellPadding: 2,
        fontSize: 12,
        valign: 'middle',
        halign: 'center',
        lineColor: blackColor
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 }
      },
      headStyles: {
        fillColor: blueColor,
        textColor: 'white',
        halign: 'center',
        }
    });
  
    // Salvando ou exibindo o PDF
    doc.save('relatorioProdutosSistemaStore.pdf');
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
    const dialogRef = this.dialog.open(ProdutoComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onAddProduto.subscribe(
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
    const dialogRef = this.dialog.open(ProdutoComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
    const sub = dialogRef.componentInstance.onEditarProduto.subscribe(
      (response) => {
        this.tableData()
      }
    )
  }

  handleDeletarAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'deletar ' + ' o produto ' + '"' + values.nome + '"'
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    const sub = dialogRef.componentInstance.emitirMudancaStatus.subscribe((response) => {
      this.deletarProduto(values.id)
      dialogRef.close()
    })
  }

  deletarProduto(id: any) {
    this.productService.delete(id).subscribe(
      (response: any) => {
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.responseMessage = "Apenas administradores têm permissão para deletar produtos";
        } else if (error.status === 404) {
          this.responseMessage = "Produto não encontrado";
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
}
