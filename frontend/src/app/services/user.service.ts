import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  [x: string]: any;
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  // Método para realizar o cadastro do usuário, retornando a URL + o método + data
  signup(data: any) {
    return this.httpClient.post(this.url + '/user/cadastrarUsuarios/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  // Método esqueciSenha
  esqueciSenha(data: any) {
    return this.httpClient.post(this.url + '/user/esqueciSenha/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  // Método login
  login(data: any) {
    return this.httpClient.post(this.url + '/user/login/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  // Método para checar Token
  checkToken() {
    return this.httpClient.get(this.url + '/user/checarToken')
  }

  // Método para mudar a senha
  mudarSenha(data: any) {
    return this.httpClient.post(this.url + 'user/alterarSenha/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
}
