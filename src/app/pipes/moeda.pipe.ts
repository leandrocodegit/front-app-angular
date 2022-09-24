import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moeda'
})
export class MoedaPipe implements PipeTransform {

  transform(value: number,  ...args: unknown[]): unknown {
    return this.subtotal(value);
  }

  public subtotal(preco: number): string{ 
    return  'R$' + preco.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) 
 }

}
