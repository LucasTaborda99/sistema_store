import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteCheckService } from '../services/route-check.service';
import { GerenciaCategoriaComponent } from './gerencia-categoria/gerencia-categoria.component';



export const MaterialRoutes: Routes = [
    {
        path: 'categoria',
        component: GerenciaCategoriaComponent,
        canActivate: [RouteCheckService],
        data: {
            roleEsperado: ['admin']
        }
    }
];
