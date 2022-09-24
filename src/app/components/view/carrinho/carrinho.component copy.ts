import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { ProdutoCarrinho } from 'src/app/models/cart/ProdutoCarrinho';
import { Produto } from 'src/app/models/produto/Produto';
import { ProdutoParceiro } from 'src/app/models/produto/ProdutoParceiro';
import { CarrinhoService } from 'src/app/services/CarrinhoService';
import { MensagemService } from 'src/app/services/MensagemService';
import { PedidoService } from 'src/app/services/pedido/PedidoService';
import { ProdutoPedido } from 'src/app/services/pedido/ProdutoPedido';
import { RouterService } from 'src/app/services/RouterService';
import { DetalhesPedidoComponent } from '../detalhes-pedido/detalhes-pedido.component';
import { ProdutoComponent } from '../produto/produto.component';

@Component({
  selector: 'spa-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {

  carrinho: ProdutoCarrinho[] = [];
  produtosPedido: ProdutoPedido[] = [];
  nameButton = "Continuar"
  isEmpty = false


  constructor(
    private routerService: RouterService,
    private router: Router,
    private mensagemService: MensagemService,
    private bottomSheet: MatBottomSheet,
    private pedidoService: PedidoService,
    private carrinhoService: CarrinhoService

  ) { }
  ngOnDestroy(): void {
    this.bottomSheet.dismiss();
  }

  ngOnInit(): void {

    this.bottomSheet.dismiss();

    //if (localStorage.getItem('cart') != null)
      this.produtosPedido = this.pedidoService.findPedido()

    if (this.carrinhoService.isEmpty()) {
      this.bottomSheet.open(DetalhesPedidoComponent);
      this.nameButton = "Escanear qrcode"
      this.isEmpty = true
    }

    var saldacao = 'Muito bom!'
    if (localStorage.getItem('isLogado') === 'true') {
      saldacao = 'Boa, ' + localStorage.getItem('name')
    }
    this.mensagemService.sendMesage([saldacao, "Aqui você vê o seu carrinho, pode edita-lo e também adicionar mais produtos."], false)
    this.routerService.savePreviosPage(this.router.url)
  }

  increment(produto: ProdutoCarrinho) {
    this.carrinhoService.incrementar(produto)
    this.carrinho = this.carrinhoService.findCarrinho()
  }
  
  decrement(produto: ProdutoCarrinho) {
    if (produto.quantidade > 1) {
      this.carrinhoService.decrementar(produto)
      this.carrinho = this.carrinhoService.findCarrinho()
    }
  }

  remove(produto: ProdutoCarrinho) {
    this.carrinhoService.remover(produto)
    this.carrinho = this.carrinhoService.findCarrinho()
    this.isEmpty = this.carrinhoService.isEmpty()
  }



  enviar() {
    if (this.carrinhoService.isEmpty()) {
      this.router.navigate(["/scan"])
    } else {
      this.router.navigate(["/cadastro"])
    }

  }


}
