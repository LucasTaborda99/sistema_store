// cliente-mais-comprou.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteMaisComprouService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}
  
  getClienteMaisComprou() {
    return this.httpClient.get(this.url + "/clienteMaisComprou/clienteMaisComprou/")
  }

  getFornecedorMaisCompras() {
    return this.httpClient.get(this.url + "/clienteMaisComprou/fornecedorMaisCompras/")
  }

  getProdutoMaisVendido() {
    return this.httpClient.get(this.url + "/clienteMaisComprou/produtoMaisVendido/")
  }
}
