import { Component, Input, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core'; 
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'; 
import { ProdutoPedido } from 'src/app/models/produto/ProdutoPedido';
import { MensagemService } from 'src/app/services/MensagemService';
import { PedidoService } from 'src/app/services/pedido/PedidoService';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'spa-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit  {

  produto:ProdutoPedido = {} as ProdutoPedido
  isViewImage = false
  mensagem: string[] = []
  total = "1000"
  

  constructor(
    private mensagemService: MensagemService,
    public viewContainerRef: ViewContainerRef,
    public pedidoService: PedidoService,
    private bottomSheetRef: MatBottomSheetRef<FooterComponent>
    ) {}
 
  ngOnInit(): void {
    this.mensagem = this.mensagemService.mensage  
    if(this.mensagem[0] == 'alert') {
      this.isViewImage = false
    }
    else{
      this.produto = this.pedidoService.findItem(this.mensagem[0])
      this.isViewImage = true
    }
  }

  openLink(event: MouseEvent): void {    
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

 
}
  