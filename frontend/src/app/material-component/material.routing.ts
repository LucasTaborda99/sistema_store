import { Routes } from '@angular/router';
import { RouteCheckService } from '../services/route-check.service';
import { GerenciaCategoriaComponent } from './gerencia-categoria/gerencia-categoria.component';
import { GerenciarUsuarioComponent } from './gerenciar-usuario/gerenciar-usuario.component';
import { GerenciarProdutoComponent } from './gerenciar-produto/gerenciar-produto.component';
import { GerenciaFornecedorComponent } from './gerencia-fornecedor/gerencia-fornecedor.component';
import { VendasComponent } from './vendas/vendas.component';
import { GerenciarClientesComponent } from './gerenciar-clientes/gerenciar-clientes.component';
import { ComprasComponent } from './compras/compras.component';

export const MaterialRoutes: Routes = [
    {
        path: 'categoria',
        component: GerenciaCategoriaComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin', 'user']
        }
    },
    {
        path: 'produto',
        component: GerenciarProdutoComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin', 'user']
        }
    },
    {
        path: 'fornecedor',
        component: GerenciaFornecedorComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin', 'user']
        }
    },
    {
        path: 'clientes',
        component: GerenciarClientesComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin', 'user']
        }
    },
    {
        path: 'compras',
        component: ComprasComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin', 'user']
        }
    },
    {
        path: 'vendas',
        component: VendasComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin', 'user']
        }
    },
    {
        path: 'usuario',
        component: GerenciarUsuarioComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin']
        }
    }
];
