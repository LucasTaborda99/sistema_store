import { Injectable } from "@angular/core"

export interface Menu{
    state: string
    nome: string
    icone: string
    role: string
}

const ITENSMENU = [
    {state: 'dashboard', nome: 'Dashboard', icone: 'dashboard', role: ''},
    {state: 'categoria', nome: 'Gerenciar Categorias', icone: 'category', role: ''},
    {state: 'produto', nome: 'Gerenciar Produtos', icone: 'inventory', role: ''},
    {state: 'fornecedor', nome: 'Gerenciar Fornecedores', icone: 'groups_3', role: ''},
    {state: 'vendas', nome: 'Gerenciar Vendas', icone: 'point_of_sale', role: ''},
    {state: 'usuario', nome: 'Gerenciar Usuários', icone: 'people', role: 'admin'}
]

@Injectable()
export class MenuItens{
    getMenuItens(): Menu[] {
        return ITENSMENU
    }
}