import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  // Método para realizar o cadastro do usuário, retornando a URL + o método + data
  signup(data: any) {
    return this.httpClient.post(this.url + '/user/cadastrarUsuarios', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  // Método esqueciSenha
  esqueciSenha(data: any) {
    return this.httpClient.post(this.url + '/user/esqueciSenha', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
}
