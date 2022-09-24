import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { CardHolder } from 'src/app/models/checkouts/CardHolder';
import { ResponseCheckout } from 'src/app/models/checkouts/ResponseCheckout';
import { Tradutor } from 'src/app/models/enuns/Tradutor';
import { Pedido } from 'src/app/models/pedidos/Pedido';
import { MensagemService } from 'src/app/services/MensagemService';
import { PagamentoService } from 'src/app/services/pagamento/PagamentoService';
import { PaymentService } from 'src/app/services/PaymentService';
import { PedidoService } from 'src/app/services/pedido/PedidoService';
import { RestPedido } from 'src/app/services/pedido/rest/RestPedido';
import { RouterService } from 'src/app/services/RouterService';
import { DetalhesPedidoComponent } from '../../view/detalhes-pedido/detalhes-pedido.component';
import { SheetComponent } from '../../view/sheet/sheet.component';
import { ConfirmComponent } from '../confirm/confirm.component';


declare var loadCardForm: any;
declare var getToken: any
declare var atualizarToken: any
declare var getValid: any
declare var focus: any

@Component({
  selector: 'spa-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {

  pedido: Pedido = {} as Pedido
  isLoad: boolean = false
  parcelas = 0
  isValid: boolean = false
  isOpen = false
  nameButton = "Pagar"
  color = "#0dcaf0"

  card: CardHolder = {} as CardHolder;
  cardNumber: string = '';
  cardExpirationMonth: string = '';
  cardExpirationYear: string = '';
  securityCode: string = '';
  tradutor: Tradutor = new Tradutor
  cardHolder = {} as CardHolder
  responsePay = {} as ResponseCheckout
  error = {} as any

  constructor(
    private pagamentoService: PagamentoService,
    private mensagemService: MensagemService,
    private paymentService: PaymentService,
    private _bottomSheet: MatBottomSheet,
    private routerService: RouterService,
    private pedidoService: PedidoService,
    private restPedido: RestPedido,
    private router: Router
  ) {

  }
  ngOnDestroy(): void {
    document.getElementById('concluir')?.style.setProperty("color", "red!important");
    this._bottomSheet.dismiss();
  }
  ngOnInit(): void {

    if(this.pedidoService.isEmpty())
      this.router.navigate(["/cart"])

    this.pedido = this.pedidoService.findPedido()  
    if(this.pedido.registro.identificador == 0){ 
      this.restPedido.gerarRegistro().subscribe(result => {
        this.pedido.registro = result
        this.pedidoService.atualizaPedido(this.pedido) 
      })
    }
    new loadCardForm()
    this.routerService.savePreviosPage(this.router.url)
  }

  execute() {
    this.updateToken()
  }

  private updateToken() {
    if (getValid()) {
      this.cardHolder = atualizarToken()
      if (this.parcelas > 0)
        this.isValid = true
    }
    else {
      this.isValid = false
    }
  }

  private pagar() {

    this.cardHolder = atualizarToken()

    if (this.isValid && this.isLoad == false) {
      this.isLoad = true
      this.nameButton = "Processando..."
      this.color = "#664a7c"
      var pedido = this.pedidoService.findPedido()
      this.cardHolder.installments = this.parcelas      
      var pedidoRequest = this.pedidoService.toConvert(pedido, this.cardHolder)
      console.log("pedidoRequest:  " + JSON.stringify(pedidoRequest))

      this.restPedido.registrarPedidoEPagar(pedidoRequest).subscribe(result => {
        //  this.pagamentoService.startCheckConfirmacaoPagamento(result.numeroPedido.toString())    
        if (result.pagamento.status == 'approved' || result.pagamento.status == 'in_process') {
          this.router.navigate(['/pedido/status/' + result.registro?.identificador]);
          this.pedidoService.savePedido(result)
        }else{
          this.isLoad = false
          this.mensagemService.sendMesage(['alert', 'Ooops!', this.tradutor.traduzirString(result.pagamento.status_detail)], false,false, 5000)
        }
      }, err => {
         
        this.pagamentoService.stopCheckConfirmacaoPagamento()
        if (err.error.type == "STOCK_ERROR"){          
          this.mensagemService.sendMesage(['alert', 'Ooops!', this.tradutor.traduzirString(err.error.type)], false,false, 5000)        
        this.restPedido.atualizaPedidoEstoque(this.pedido).subscribe(result => {
          this.pedidoService.atualizaPedido(result)
        })


        var intervalError = setInterval(() => {
          this.router.navigate(["/cart"])
          clearInterval(intervalError)
        }, 5000)
      }else{
        this.mensagemService.sendMesage(['alert', 'Ooops!', 'Algo deu errado.'], false, false, 5000)  
        this.isLoad = false
      }


      })
    }
  }

  voltar(){
    localStorage.removeItem('pay')
    this.router.navigate(['/pagamento'])

  }

  registraPedido() {
    this.pagar()
  }

  openSheet(): void {

    if (this.isOpen) {
      this._bottomSheet.dismiss();
      this.isOpen = false
    } else {
      this._bottomSheet.open(ConfirmComponent);
      this.isOpen = true
    }
  }
}
