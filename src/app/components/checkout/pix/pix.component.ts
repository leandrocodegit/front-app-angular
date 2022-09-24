import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Pagamento } from 'src/app/models/checkouts/Pagamento';
import { Status } from 'src/app/models/enuns/Status';
import { Tradutor } from 'src/app/models/enuns/Tradutor';
import { Pedido } from 'src/app/models/pedidos/Pedido';
import { MensagemService } from 'src/app/services/MensagemService';
import { PagamentoService } from 'src/app/services/pagamento/PagamentoService';
import { PedidoService } from 'src/app/services/pedido/PedidoService';
import { RestPagamento } from 'src/app/services/pedido/rest/RestPagamento';
import { RestPedido } from 'src/app/services/pedido/rest/RestPedido';

@Component({
  selector: 'spa-pix',
  templateUrl: './pix.component.html',
  styleUrls: ['./pix.component.css']
})
export class PixComponent implements OnInit {

  color = "#664a7c"
  nameButton = "Carregando..."
  tradutor: Tradutor = {} as Tradutor
  pedido: Pedido = new Pedido
  isLoad = true;
  isView = true;
  isConfirma = false;


  constructor(
    private pagamentoService: PagamentoService,
    private mensagemService: MensagemService,
    private pedidoService: PedidoService,
    private bottomSheet: MatBottomSheet,
    private restPedido: RestPedido,
    private router: Router
  ) {
    this.tradutor = new Tradutor
  }

  ngOnInit(): void {

    if (this.pedidoService.isEmpty())
      this.router.navigate(["/cart"])

    this.pedido = this.pedidoService.findPedido()
    if (this.pedido.registro.identificador == 0) {
      this.restPedido.gerarRegistro().subscribe(result => {
        this.pedido.registro = result
        this.pedidoService.atualizaPedido(this.pedido)
      })
    }

    var interval = setInterval(() => {
      if (this.pedido.pagamento == null || this.pedido.pagamento.id == 0)
          this.restPedido.registrarPedidoPix(this.pedido).subscribe(result => {
          this.pedido = result
          this.pedidoService.atualizaPedido(this.pedido)

        }, err => {
          clearInterval(interval)
          this.pagamentoService.stopCheckConfirmacaoPagamento()
          if (err.error.type == "STOCK_ERROR") {

            this.mensagemService.sendMesage(['alert', 'Ooops!', this.tradutor.traduzirString(err.error.type)], false, false, 5000)

            this.restPedido.atualizaPedidoEstoque(this.pedido).subscribe(result => {
              this.pedidoService.atualizaPedido(result)
            })

            var intervalError = setInterval(() => {
              this.router.navigate(["/cart"])
              clearInterval(intervalError)
            }, 5000)
          }
        })
      if (this.pedido.pagamento != null)
        if (this.pedido.pagamento.point_of_interaction.transaction_data.qr_code_base64.length > 100) {
          this.isLoad = false;
          this.color = "black"
          this.nameButton = "Copiar chave"
          clearInterval(interval)
          this.checkPagamentoPix()
        }
    }, 5000)
  }

  checkPagamentoPix() {

    var pedido = this.pedidoService.findPedido()
    console.log("***************** Pix " + pedido.pagamento.status)
    if (pedido.pagamento.status == 'pending') {
      this.pagamentoService.startCheckConfirmacaoPagamento(pedido.registro.identificador.toString())
    }
  }

  enviar() {
    navigator.clipboard.writeText(this.pedido.pagamento.point_of_interaction.transaction_data.qrCode);
    if (this.pedido.pagamento.point_of_interaction.transaction_data.qrCode.length > 100)
      this.mensagemService.sendMesage(['alert', '', 'Show!', 'Pix foi copiado'], false,false, 3000)
    else
      this.mensagemService.sendMesage(['alert', 'Ooops!', 'Pagamento ainda não foi gerado'], false,false, 3000)
  }

  sim() {
    this.pagamentoService.stopCheckConfirmacaoPagamento()
    localStorage.removeItem('pay')
    this.router.navigate(["/pagamento"])
    this.bottomSheet.dismiss()
  }

  nao() {
    console.log("comfirmar nao ")
    this.isView = false
  }

  voltar() {
    if (!this.pedidoService.isEmpty()) {
      if (localStorage.getItem('pay') != null) {
        if (localStorage.getItem('pay') == 'pix') {
          if (this.pagamentoService.isChecking()) {
            this.mensagemService.sendMesage(['alert', '', 'Deseja fazer alterações no pedido?', 'Faça isso caso ainda não tenha feito pagamento.'], false, false, 30000)
            this.isView = false
            this.isConfirma = true
          }
        }
        else {
          localStorage.removeItem('pay')
          this.router.navigate(["/pagamento"])
        }
      }
      else {
        this.router.navigate(['/cart'])
      }
    }
  }

  registraPedido(): Pedido {
    var pedido = this.pedidoService.findPedido()
    return this.pedido
  }

}
