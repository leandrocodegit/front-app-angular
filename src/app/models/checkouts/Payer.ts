import { Identification } from "./Identification"

export class Payer { 
    constructor(
        public email: string = "",
        identification: Identification = new Identification) { }


}