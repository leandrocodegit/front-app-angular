import { PaymentPointOfInteraction } from "./PaymentPointOfInteraction";

export class Pagamento{
    constructor()
    constructor(
        public id: number = 0,
        public payment_method_id: string = "",
        public payment_type_id: string = "",
        public status: string = "",
        public status_detail: string = "",
        public transaction_amount: number = 0,
        public installments: number = 0,
        public point_of_interaction: PaymentPointOfInteraction = new PaymentPointOfInteraction
    ){}

}