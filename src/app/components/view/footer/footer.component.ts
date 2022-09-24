import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { MensagemService } from 'src/app/services/MensagemService';
import { DetalhesPedidoComponent } from '../detalhes-pedido/detalhes-pedido.component';
import { PedidoService } from 'src/app/services/pedido/PedidoService';
import { Status } from 'src/app/models/enuns/Status';
import { PagamentoService } from 'src/app/services/pagamento/PagamentoService';
import { Location } from '@angular/common';
import { QRCode } from 'src/app/models/qrcode/QRCode';
import { RouterService } from 'src/app/services/RouterService';

@Component({
  selector: 'spa-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  nextUrl: String = "" 
  
  isOpen: boolean = false
  path = ""
  itens = 0
  @Input() nameButton: string = "Botao"
  @Input() name: string = this.nameButton
  @Input() color: string = "black"
  @Input() colorIcons: string = "black"
  @Output() eventSheet = new EventEmitter
  @Output() eventFooter = new EventEmitter
  @Output() eventConfirmarNao = new EventEmitter
  @Output() eventConfirmarSim = new EventEmitter
  @Output() eventVoltar = new EventEmitter
  @Input() isView = true
  @Input() isViewIcons = true
  @Input() isConfirmar = false
  @Input() isViewCest = true
  @Input() isChange = false
  service: PedidoService = {} as PedidoService

  constructor(
    private pagamentoService: PagamentoService,
    private mensagemService: MensagemService,
    private routerService: RouterService,
    private pedidoService: PedidoService,
    private bottomSheet: MatBottomSheet,
    private router: Router
  ) {
    this.service = pedidoService
  }
  ngOnInit(): void {
    this.bottomSheet.dismiss()
    var pedido = this.pedidoService.findPedido()
    this.updateCart()
    if (!this.pedidoService.isEmpty()) {
      if (pedido.pagamento != null && pedido.pagamento.status == 'approved') {
        
        if (this.router.url.includes("scan")) {
          localStorage.removeItem('pedido')
          localStorage.removeItem('cadastro')
        }else{
          this.router.navigate(['/pedido/status/' + pedido.registro.identificador]);
        }
      } 
    }

    if (this.router.url == '/scan') { 
      this.isChange = true
    }
    if (this.router.url.includes('pagamento/')) {
      this.isChange = true
    }

    this.bottomSheet._openedBottomSheetRef?.afterOpened().subscribe(() => {
      this.isOpen = true
    })
  }

  openBottomSheet(): void {
    console.log("footer")
    if (!this.router.url.includes('pagamento/') || this.router.url.includes('pagamento/pix')) {
      if (this.isOpen) {
        this.bottomSheet.dismiss();
        this.isOpen = false
      }
      else {
        if(this.pedidoService.isEmpty() && !this.router.url.includes('scan/'))
          this.mensagemService.sendMesage(['alert', 'Ooopa, quase lá.', 'Scanei um qrcode para continuar.'], false, false, 6000)
        else this.bottomSheet.open(DetalhesPedidoComponent);
          this.isOpen = true
      }
    }
  }

  redirect() {
    if (localStorage.getItem("isLogado") !== "true") {
      this.nextUrl = "/login"
    }
  }

  private updateCart() {
    this.itens = this.pedidoService.findPedido().itens
  }

  enviar(event: any) {
    this.eventFooter.emit(event)
  }

  scan(){
    this.routerService.savePreviosPage(this.router.url)
    this.router.navigate(["/scan"])
  }

  sim(event: any) {
    this.eventConfirmarSim.emit(event)
  }

  nao(event: any) {
    this.isConfirmar = false;
    this.isView = true
    this.eventConfirmarNao.emit(event)
  }

  voltar(event: any) {
    this.eventVoltar.emit(event)
  }

  void() {
    if (localStorage.getItem('cadastro') != null) {
      if (localStorage.getItem('cadastro') == 'pendente') {
        this.router.navigate(["/pagamento/confirm"])
      }
      else {
        this.router.navigate(['/pagamento'])
      }
    }
    this.router.navigate([this.nextUrl])
  }

  
}
