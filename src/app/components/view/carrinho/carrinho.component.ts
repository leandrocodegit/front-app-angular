import { Component, EventEmitter, Input, OnInit, Output,OnDestroy } from '@angular/core'; 
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';  
import { Pedido } from 'src/app/models/pedidos/Pedido';
import { ProdutoPedido } from 'src/app/models/produto/ProdutoPedido'; 
import { QRCode } from 'src/app/models/qrcode/QRCode';
import { MensagemService } from 'src/app/services/MensagemService';
import { PagamentoService } from 'src/app/services/pagamento/PagamentoService';
import { PedidoService } from 'src/app/services/pedido/PedidoService';  
import { RouterService } from 'src/app/services/RouterService';
import { DetalhesPedidoComponent } from '../detalhes-pedido/detalhes-pedido.component';

@Component({
  selector: 'spa-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit, OnDestroy {
   
  produtosPedido: ProdutoPedido[] = [];
  nameButton = "Continuar"
  isChange = false;
  isEmpty = false
 

  constructor( 
    private pagamentoService: PagamentoService,
    private pedidoService: PedidoService, 
    private mensagemService: MensagemService,   
    private bottomSheet: MatBottomSheet,
    private router: Router, 
    

  ) { }
  ngOnDestroy(): void {
    this.bottomSheet.dismiss();    
  }

  ngOnInit(): void {   
    
    this.bottomSheet.dismiss();
     if (localStorage.getItem('pedido') != null){
      var pedido = this.pedidoService.findPedido()
      this.produtosPedido = pedido.produtos   
      this.pedidoService.verificaEstoqueProdutosCarrinho(pedido)
         
     }
        

     if(this.pedidoService.isEmpty()){
      //this.mensagemService.sendMesage(['alert', 'Ooops!',' Seu carrinho está vazio.'], true, 10000)
      this.nameButton = "Scanear"
      this.isEmpty = true
      this.isChange = true
     }
  }

  increment(produto: ProdutoPedido) {
   this.produtosPedido = this.pedidoService.incrementar(produto.qrcode)    
   this.pagamentoService.stopCheckConfirmacaoPagamento()
  }
  
  decrement(produto: ProdutoPedido) {
    if (produto.quantidade > 1) {
      this.produtosPedido =  this.pedidoService.decrementar(produto.qrcode) 
      this.pagamentoService.stopCheckConfirmacaoPagamento()
    }
  }

  remove(produto: ProdutoPedido) {
    this.produtosPedido = this.pedidoService.remover(produto.qrcode) 
    this.pagamentoService.stopCheckConfirmacaoPagamento()
  }

  voltar(){
    if (localStorage.getItem('qrcode') != null) {
      var qrcode: QRCode = JSON.parse(localStorage.getItem('qrcode')!)
      this.router.navigate(['/scan/' + qrcode.id])
    }
    else{
      this.router.navigate(['/scan'])
    } 
  }
 
  enviar() {
    if (this.pedidoService.isEmpty()) {
      this.router.navigate(["/scan"])
    } else {
      this.router.navigate(["/cadastro"])
    }
  }
 
}
