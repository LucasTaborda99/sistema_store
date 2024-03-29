import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControleEstoqueService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) {}

  adicionar(data: any) {
    return this.httpClient.post(this.url + '/controleEstoque/registrarControleEstoque/', data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  update(data: any) {
    return this.httpClient.post(this.url + "/controleEstoque/atualizarControleEstoque/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  get() {
    return this.httpClient.get(this.url + "/controleEstoque/getControleEstoque/")
  }
  
  delete(id: any) {
    return this.httpClient.delete(`${this.url}/controleEstoque/deletarControleEstoque/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
  
}
