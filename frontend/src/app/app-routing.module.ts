import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { RouteCheckService } from './services/route-check.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'sistemastore',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/sistemastore/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),
          canActivate: [RouteCheckService],
          data:{
            roleEsperado: ['admin', 'user']
          }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate:[RouteCheckService],
        data:{
          roleEsperado: ['admin', 'user']
        }
      }
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
