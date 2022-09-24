import { Estoque } from "./Estoque";

export interface Produto{
     codigo: String,
     descricao: String,
     marca: String,
     estoque: Estoque,
     imageOriginal: String,
     imageThumbnail: String

}