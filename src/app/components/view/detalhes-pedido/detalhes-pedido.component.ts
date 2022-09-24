import { Component, OnDestroy, OnInit } from '@angular/core';  
import { Pedido } from 'src/app/models/pedidos/Pedido';
import { PedidoService } from 'src/app/services/pedido/PedidoService';  

@Component({
  selector: 'spa-detalhes-pedido',
  templateUrl: './detalhes-pedido.component.html',
  styleUrls: ['./detalhes-pedido.component.css']
})
export class DetalhesPedidoComponent implements OnInit, OnDestroy {

  pedido: Pedido = {} as Pedido 
  mensagem: string[] = []

  constructor(
    private pedidoService: PedidoService,    
  ) { }
  ngOnDestroy(): void {
    this.mensagem = []
  }

  ngOnInit(): void {
    console.log("detalhes")
    this.pedido = this.pedidoService.findPedido()
    console.log("Pedido " + this.pedido.total)     
  } 
}
