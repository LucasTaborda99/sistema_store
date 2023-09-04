import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage: any
	data: any
	token: any
	isDarkMode: boolean = false;

	ngAfterViewInit() { }

	constructor(private dashboardService: DashboardService, private snackbarService: SnackbarService) {
		this.dashboardData()
	}

	generatePDF() {
		// Criando uma instância do jsPDF
		const doc = new jsPDF();
	
		// Definindo as informações do relatório
		const columns = ['Categorias', 'Produtos', 'Fornecedores', 'Compras', 'Vendas', 'Clientes', 'Controle de Estoque'];
		
		// Obtendo os valores diretamente da tela
		const categoriaValue = document.getElementById('categoriasCount');
		const categoriasCount = categoriaValue ? categoriaValue.textContent : '';
		
		const produtosValue = document.getElementById('produtosCount');
		const produtosCount = produtosValue ? produtosValue.textContent : '';

		const fornecedoresValue = document.getElementById('fornecedoresCount');
		const fornecedoresCount = fornecedoresValue ? fornecedoresValue.textContent : '';

		const comprasValue = document.getElementById('comprasCount');
		const comprasCount = comprasValue ? comprasValue.textContent : '';

		const vendasValue = document.getElementById('vendasCount');
		const vendasCount = vendasValue ? vendasValue.textContent : '';

		const clientesValue = document.getElementById('clientesCount');
		const clientesCount = clientesValue ? clientesValue.textContent : '';

		const controleEstoqueValue = document.getElementById('controleEstoqueCount');
		const controleEstoqueCount = controleEstoqueValue ? controleEstoqueValue.textContent : '';
		
		const data = [
		  [
			categoriasCount,
			produtosCount,
			fornecedoresCount,
			comprasCount,
			vendasCount,
			clientesCount,
			controleEstoqueCount
		  ]
		];
	
		// Adicionando o título do relatório
		doc.setFontSize(18);

		// Definindo o alinhamento horizontal como 'center'
		doc.text('Relatório do Dashboard - SistemaStore', 105, 10, { align: 'center' });
		
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
			0: { cellWidth: 27 },
			1: { cellWidth: 24 },
			2: { cellWidth: 35 },
			3: { cellWidth: 24 },
			4: { cellWidth: 24 },
			5: { cellWidth: 24 },
			6: { cellWidth: 28 }
		  },
		  headStyles: {
			fillColor: blueColor,
			textColor: 'white',
			halign: 'center',
		  }
		});
		
		console.log('PDF gerado com sucesso.');

		// Salvando ou exibindo o PDF
		doc.save('relatorioDashboardSistemaStore.pdf');
	  }

	toggleDarkMode() {
		this.isDarkMode = !this.isDarkMode;
	  }

	dashboardData() {
		this.dashboardService.getDetails().subscribe((response: any) => {
			this.data = response
			console.log(this.data)
		}, (error: any) => {
			console.log(error)
			if(error.error?.message) {
				this.responseMessage = error.error?.message
			} else {
				this.responseMessage = GlobalConstants.genericError
			}
			this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
		})
	}
}
