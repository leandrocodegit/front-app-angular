import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginService } from "../../LoginService"; 
import { Usuario } from "../../../models/usuario/Usuario";
import { UsuarioService } from "../../usuario/UsuarioService";  
import { PedidoService } from "../PedidoService";
import { Pagamento } from "src/app/models/checkouts/Pagamento";
import { Pedido } from "src/app/models/pedidos/Pedido";

@Injectable({
  providedIn: 'root'
})
export class RestPagamento {


  constructor(
    private httpClient: HttpClient) {
  }

  responsePay = {} as Pedido

  gerarPix(numeroPedido: String): Observable<Pagamento> { 
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    };
    return this.httpClient.get<Pagamento>("http://localhost:9098/api/v1/pay/pix/create/" + numeroPedido,  options)
  }

  buscaQRCode(id: String): Observable<any>{ 
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    };
    return this.httpClient.get<any>("http://localhost:9098/api/v1/pay/pix/qrcode/id/" + id,  options)    
  }

 
}