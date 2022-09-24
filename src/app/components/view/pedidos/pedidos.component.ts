import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pagamento } from 'src/app/models/checkouts/Pagamento';
import { Status } from 'src/app/models/enuns/Status';
import { Tradutor } from 'src/app/models/enuns/Tradutor';
import { Pedido } from 'src/app/models/pedidos/Pedido';
import { PedidoResponse } from 'src/app/models/pedidos/response/PedidoResponse';
import { ProdutoPedido } from 'src/app/models/produto/ProdutoPedido';
import { MensagemService } from 'src/app/services/MensagemService';
import { PedidoService } from 'src/app/services/pedido/PedidoService';
import { RestPedido } from 'src/app/services/pedido/rest/RestPedido';
import { RouterService } from 'src/app/services/RouterService';

@Component({
  selector: 'spa-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit, OnDestroy {

  color = 'black'
  isConfirmar = false
  nameButton = 'Novo pedido'
  pedidos: Pedido[] = []
  tradutor: Tradutor = {} as Tradutor
  panelOpenState = false;
  status: Status = Status.NEW
  pedidoRefazer: Pedido = new Pedido()

  constructor(
    private mensagemService: MensagemService,
    private pedidoService: PedidoService,
    private routerService: RouterService,
    private restPedido: RestPedido,
    private router: Router
  ) {
    this.tradutor = new Tradutor
  }

  ngOnInit(): void {

    var x = ""
    var pedido: Pedido

    this.restPedido.listPedidos().subscribe(result => {
      console.log(JSON.stringify(result))
      this.pedidos = result
      pedido = result[0] 
    })
  }

  ngOnDestroy(): void {
    this.routerService.savePreviosPage(this.router.url)
  }

  devolver(pedidoRef: Pedido) {
    this.router.navigate(["/devolucao/" + pedidoRef.registro.identificador])
  }

  refazer(pedidoRef: Pedido) {
    this.restPedido.gerarRegistro().subscribe(result => {
      localStorage.removeItem('pedido')
      localStorage.removeItem('cadastro')
      var pedido = new Pedido()
      pedido.produtos = pedidoRef.produtos
      pedido.status = Status.PENDENTE 
      pedido.usuario = pedidoRef.usuario
      pedido.registro = result
      this.pedidoRefazer = pedido

     

      this.restPedido.criarPedido(pedido).subscribe(result => {
        localStorage.setItem('pedido', JSON.stringify(pedido))
        this.pedidoService.atualizaPedido(pedido)
        this.router.navigate(["/cart"])
      }, err => {
        this.mensagemService.sendMesage(['alert','', 'Informação importante!', 'Alguns itens desse pedido foram alterados.'], false, true, 8000)
        this.nameButton = "Continuar"
        this.color = 'red'
        this.isConfirmar = true
      })
    })
  }

  sim() { 
    console.log('Pedido ---------------- ' + JSON.stringify(this.pedidoRefazer))
    this.restPedido.atualizaPedidoItens(this.pedidoRefazer).subscribe(result => {
      this.pedidoService.verificaEstoqueProdutosCarrinho(result)
      this.pedidoService.atualizaPedido(result)
      this.pedidoService.verificaEstoqueProdutosCarrinho(result)
      console.log('Pedido resultado ++++++++++++++++++++++++++' + JSON.stringify(result))
      this.router.navigate(["/cart"])            
    })
   
  }

  pagar(pedido: Pedido) {
    //localStorage.setItem('pedido',id)
    localStorage.removeItem('cadastro')
    this.pedidoService.atualizaPedido(pedido)
    this.router.navigate(["/cart"])
  }

  enviar() {
    console.log('Clicou no carrinho')
    this.router.navigate(["/scan"])
  }


}
