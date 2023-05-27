import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Verificando se o token está autenticado ou não
  public isAutenticado(): boolean {
    const token = localStorage.getItem('token')

    if(!token) {
      this.router.navigate(['/'])
      return false
    } else {
      return true
    }
  }
}
