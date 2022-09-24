import { CardHolder } from "src/app/models/checkouts/CardHolder"; 
import { ProdutoPedido } from "../../produto/ProdutoPedido";
import { Usuario } from "../../usuario/Usuario";
import { Registro } from "../Registro";
 

export class PedidoRequestPayment{ 
 
    constructor(  
        public registro: Registro = new Registro,
        public produtos: ProdutoPedido[]= [],
        public total: number = 0,
        public desconto: number = 0,
        public itens: number = 0,
        public usuario?: Usuario,  
        public pagamento?: CardHolder,   
    ){}
}