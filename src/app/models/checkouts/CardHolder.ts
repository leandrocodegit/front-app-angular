import { Payer } from "./Payer"

export class CardHolder {
    

    constructor(
       public token: string = "",
       public issuer_id: string = "",
       public payment_method_id: string = "",
       public transaction_amount: string = "",
       public installments: number = 0,
       public numero_pedido: number = 0,
       public payer: Payer = new Payer
    ) {}
}