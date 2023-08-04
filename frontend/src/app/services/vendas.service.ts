import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendasService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) {}

  registrar(data: any) {
    return this.httpClient.post(this.url + '/vendas/registrarVenda/', data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  get() {
    return this.httpClient.get(this.url + "/vendas/getVenda/")
  }

}
