import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import jwt_decode from 'jwt-decode'
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteCheckService {

  constructor(public auth: AuthService, public router: Router, private snackbarService: SnackbarService) {}
  
  // Verificando se o usuário tem acesso através do role, pelo decode do token
  canActivate(route: ActivatedRouteSnapshot): boolean {

    // Recuperando os dados no array
    let roleEsperadoArray = route.data;
    roleEsperadoArray = roleEsperadoArray.roleEsperado

    const token: any = localStorage.getItem('token')
    let tokenPayload: any

    try {
      // Recuperando o token
      tokenPayload = jwt_decode(token)

    } catch(err) {
      localStorage.clear()
      this.router.navigate(['/'])
    }

    let checkRole = false

    // Loop para verificar se o role que vem do array 'bate' com o role do usuário que foi recuperado através do token
    for(let i=0; i<roleEsperadoArray.length; i++) {
      if(roleEsperadoArray[i] == tokenPayload.role) {
        checkRole = true
      }
    }

    // Verificando o role e se está autenticado
    if(tokenPayload.role === 'user' || tokenPayload.role === 'admin') {
      if(this.auth.isAutenticado() && checkRole) {
        return true
      }
      this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error)
      this.router.navigate(['/sistemastore/dashboard'])
      return false
    }
    
    // Caso contrário, retornará para a página inicial
    else {
      this.router.navigate(['/'])
      localStorage.clear()
      return false
    }
  }
}
