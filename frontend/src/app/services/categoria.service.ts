import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  adicionar(data: any) {
    return this.httpClient.post(this.url + "/categoria/adicionarCategoria/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  update(data: any) {
    return this.httpClient.patch(this.url + "/categoria/updateCategoria/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  getCategoria() {
    return this.httpClient.get(this.url + "/categoria/getCategoria/")
  }
}
