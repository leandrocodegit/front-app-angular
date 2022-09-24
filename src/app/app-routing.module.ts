import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { CardComponent } from './components/checkout/card/card.component';
import { ConfirmComponent } from './components/checkout/confirm/confirm.component';
import { PixComponent } from './components/checkout/pix/pix.component';
import { StatusComponent } from './components/view/pedidos/status/status.component';
import { QrCodeComponent } from './components/scan/qr-code/qr-code.component'; 
import { LoginComponent } from './components/social/login/login.component'; 
import { CadastroComponent } from './components/view/cadastro/cadastro.component';
import { CarrinhoComponent } from './components/view/carrinho/carrinho.component';
import { DevolucaoComponent } from './components/view/devolucao/devolucao.component';
import { FormaPagamentoComponent } from './components/view/forma-pagamento/forma-pagamento.component';
import { PedidosComponent } from './components/view/pedidos/pedidos.component';
import { ProdutoComponent } from './components/view/produto/produto.component';

const routes: Routes = [
 
  //{ path: '', component: ProdutoComponent } , 
  { path: 'scan/:qrcode', component: ProdutoComponent } , 
  //{ path: 'login/sucess', redirectTo: 'pagamento', pathMatch: 'full' },
  { path: 'scan', component: QrCodeComponent } ,
  { path: 'login', component: LoginComponent } ,   
  { path: 'login/:credential', component: LoginComponent } ,
  { path: 'auth', component: LoginComponent } ,
  { path: 'cart', component: CarrinhoComponent } ,
  { path: 'cadastro', component: CadastroComponent } ,
  { path: 'pagamento', component: FormaPagamentoComponent },
  { path: 'pagamento/confirm', component: ConfirmComponent },
  { path: 'pagamento/card', component: CardComponent },
  { path: 'pagamento/pix', component: PixComponent },
  { path: 'pedido/list', component: PedidosComponent },
  { path: 'pedido/status', component: StatusComponent },
  { path: 'pedido/status/:id', component: StatusComponent },
  { path: 'devolucao/:id', component: DevolucaoComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
