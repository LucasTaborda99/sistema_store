import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { GerenciaCategoriaComponent } from './gerencia-categoria/gerencia-categoria.component';
import { CategoriaComponent } from './dialog/categoria/categoria.component';
import { GerenciarUsuarioComponent } from './gerenciar-usuario/gerenciar-usuario.component';
import { GerenciarProdutoComponent } from './gerenciar-produto/gerenciar-produto.component';
import { ProdutoComponent } from './dialog/produto/produto.component';
import { GerenciaFornecedorComponent } from './gerencia-fornecedor/gerencia-fornecedor.component';
import { FornecedorComponent } from './dialog/fornecedor/fornecedor.component';
import { VendasComponent } from './vendas/vendas.component';
import { GerenciarClientesComponent } from './gerenciar-clientes/gerenciar-clientes.component';
import { ClienteComponent } from './dialog/cliente/cliente.component';
import { ComprasComponent } from './compras/compras.component';
import { ControleEstoqueComponent } from './controle-estoque/controle-estoque.component';
import { EstoqueComponent } from './dialog/estoque/estoque.component';
import { ClienteMaisComprouComponent } from './cliente-mais-comprou/cliente-mais-comprou.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  declarations: [
    ConfirmationComponent,
    ChangePasswordComponent,
    GerenciaCategoriaComponent,
    CategoriaComponent,
    GerenciarUsuarioComponent,
    GerenciarProdutoComponent,
    ProdutoComponent,
    GerenciaFornecedorComponent,
    FornecedorComponent,
    VendasComponent,
    GerenciarClientesComponent,
    ClienteComponent,
    ComprasComponent,
    EstoqueComponent,
    ControleEstoqueComponent,
    ClienteMaisComprouComponent    
  ]
})
export class MaterialComponentsModule {}
