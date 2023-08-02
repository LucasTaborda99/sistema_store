import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) {}

  adicionar(data: any) {
    return this.httpClient.post(this.url + '/fornecedor/adicionarFornecedor/', data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  update(data: any) {
    return this.httpClient.patch(this.url + "/fornecedor/updateFornecedor/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  get() {
    return this.httpClient.get(this.url + "/fornecedor/getFornecedor/")
  }

  updateStatus(data: any) {
    return this.httpClient.patch(this.url + "/fornecedor/updateFornecedor/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  delete(id: any) {
    const data = { id: id };
    return this.httpClient.patch(this.url + "/fornecedor/deleteFornecedor/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

}
