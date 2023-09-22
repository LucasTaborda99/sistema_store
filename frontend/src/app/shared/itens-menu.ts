import { Injectable } from "@angular/core"

export interface Menu{
    state: string
    nome: string
    icone: string
    role: string
}

const ITENSMENU = [
    {state: 'dashboard', nome: 'Dashboard', icone: 'dashboard', role: ''},
    {state: 'estatistica', nome: 'Estatisticas', icone: 'query_stats', role: 'admin'},
    {state: 'categoria', nome: 'Gerenciar Categorias', icone: 'category', role: ''},
    {state: 'produto', nome: 'Gerenciar Produtos', icone: 'inventory', role: ''},
    {state: 'controleEstoque', nome: 'Controle Estoque', icone: 'settings', role: 'admin'},
    {state: 'fornecedor', nome: 'Gerenciar Fornecedores', icone: 'group', role: ''},
    {state: 'clientes', nome: 'Gerenciar Clientes', icone: 'groups_3', role: ''},
    {state: 'compras', nome: 'Registrar Compras', icone: 'receipt_long', role: ''},
    {state: 'vendas', nome: 'Registrar Vendas', icone: 'point_of_sale', role: ''},
    {state: 'usuario', nome: 'Gerenciar Usuários', icone: 'people', role: 'admin'}
]

@Injectable()
export class MenuItens{
    getMenuItens(): Menu[] {
        return ITENSMENU
    }
}