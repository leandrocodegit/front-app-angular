import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { throwError } from "rxjs"
import { CardHolder } from "src/app/models/checkouts/CardHolder"
import { Pagamento } from "src/app/models/checkouts/Pagamento"
import { Status } from "src/app/models/enuns/Status"
import { Pedido } from "src/app/models/pedidos/Pedido"
import { Registro } from "src/app/models/pedidos/Registro"
import { PedidoRequest } from "src/app/models/pedidos/request/PedidoRequest"
import { PedidoRequestPayment } from "src/app/models/pedidos/request/PedidoRequestPayment"
import { ProdutoPedido } from "src/app/models/produto/ProdutoPedido"
import { QRCode } from "src/app/models/qrcode/QRCode"
import { Usuario } from "src/app/models/usuario/Usuario"
import { MensagemService } from "../MensagemService"
import { PagamentoService } from "../pagamento/PagamentoService"

@Injectable({
    providedIn: 'root'
})
export class PedidoService {

    constructor(
        private mensagemService: MensagemService,
        private httpClient: HttpClient


    ) { }


    toConvert(pedido: Pedido, cardHolder: CardHolder): PedidoRequestPayment {
        var user: Usuario = JSON.parse(localStorage.getItem('usuario')!)
        return new PedidoRequestPayment(
            pedido.registro,
            pedido.produtos,
            pedido.total,
            pedido.desconto,
            pedido.itens,
            user,
            cardHolder)
    }

    findPedido(): Pedido {
        if (localStorage.getItem('pedido') != null) {
            console.log("find")
            return JSON.parse(localStorage.getItem('pedido') as string)
        }
        return new Pedido(new Registro)
    }


    isEmpty(): boolean {
        if (localStorage.getItem('pedido') != null) {
            if (this.findPedido().produtos.length > 0)
                return false
        }
        return true
    }

    isContainsProduto(id: String): boolean {

        var carrinho: ProdutoPedido[] = this.findPedido().produtos

        for (let index = 0; index < carrinho.length; index++) {
            const element = carrinho[index];
            if (element.qrcode.id == id) {
                return true
                break
            }
        }
        return false
    }

    savePedido(pedido: Pedido) {
        console.log("#### " + JSON.stringify(pedido))
        localStorage.setItem('pedido', JSON.stringify(pedido))
    }

    atualizaPedido(pedido: Pedido): Pedido {

        if (pedido.status != Status.APROVADO) {
            pedido.status = Status.NEW
            if (pedido.produtos.length > 0) {
                var total = 0
                var desconto = 0
                var itens = 0

                for (let index = 0; index < pedido.produtos.length; index++) {
                    const element = pedido.produtos[index];

                    if (element.qrcode.produto.estoque.estoqueAtual <= 0) {
                        this.mensagemService.sendMesage(
                            ['produto',
                                element.qrcode.produto.imageThumbnail.toString(),
                                element.qrcode.produto.descricao.toString(),
                                'Indisponivel!'
                            ], true, false, 5000)
                        continue
                    }
                    console.log("Atualizando...")

                    if (element.quantidade > element.qrcode.produto.estoque.estoqueAtual)
                        element.quantidade = element.qrcode.produto.estoque.estoqueAtual
                    total += element.qrcode.preco * element.quantidade
                    if (element.qrcode.multi_desconto) {
                        desconto += element.qrcode.desconto * element.quantidade
                    } else {
                        desconto += element.qrcode.desconto
                    }
                    itens += element.quantidade
                }
                pedido.subTotal = Number.parseFloat((total).toFixed(2))
                pedido.total = Number.parseFloat((total - desconto).toFixed(2))
                pedido.desconto = Number.parseFloat((desconto).toFixed(2))
                pedido.itens = itens

                this.savePedido(pedido)                
                return pedido
            }
        }

        return this.findPedido()
    }


    verificaEstoqueProdutosCarrinho(pedido: Pedido) {

        console.log("Verificando")
        pedido.produtos.forEach(element => {

            console.log("Verificando  " + element.qrcode.produto.estoque.estoqueAtual)
            if (element.qrcode.produto.estoque.estoqueAtual <= 0) {
                console.log("Enviando mensagem  " + element.qrcode.produto.estoque.estoqueAtual)
                this.mensagemService.sendMesage(
                    ['produto',
                        element.qrcode.produto.imageThumbnail.toString(),
                        element.qrcode.produto.descricao.toString(),
                        'Indisponivel!'
                    ], true, true, 5000)
            }
        })
    }

    findItem(id: string): ProdutoPedido {
        this.findPedido().produtos.forEach(element => {
            if (element.qrcode.id == id)
                return element
            return {} as ProdutoPedido
        });
        return {} as ProdutoPedido
    }

    adicionar(qrCode: QRCode) {
        if (!this.isContainsProduto(qrCode.id)) {
            var pedido: Pedido = this.findPedido()
            pedido.produtos[pedido.produtos.length] = new ProdutoPedido(qrCode, 1)
            this.atualizaPedido(pedido)
        }
    }

    incrementar(qrCode: QRCode): ProdutoPedido[] {
        var pedido: Pedido = this.findPedido()
        console.log("INC+++++++++++ " + JSON.stringify(pedido))

        pedido.pagamento = new Pagamento
        var carrinho: ProdutoPedido[] = pedido.produtos

        carrinho.forEach(element => {
            if (element.qrcode.id == qrCode.id) {
                element.quantidade++
            }
        });
        this.atualizaPedido(pedido)
        return carrinho
    }

    decrementar(qrCode: QRCode): ProdutoPedido[] {

        var pedido: Pedido = this.findPedido()
        pedido.pagamento = new Pagamento
        var carrinho: ProdutoPedido[] = pedido.produtos

        carrinho.forEach(element => {
            if (element.qrcode.id == qrCode.id) {
                if (element.quantidade > 1) {
                    element.quantidade--
                }
            }
        });
        this.atualizaPedido(pedido)
        return carrinho
    }

    remover(qrCode: QRCode): ProdutoPedido[] {

        var pedido: Pedido = this.findPedido()
        pedido.pagamento = new Pagamento
        var carrinho: ProdutoPedido[] = pedido.produtos

        for (let index = 0; index < carrinho.length; index++) {
            const element = carrinho[index];
            if (element.qrcode.id == qrCode.id) {
                carrinho.splice(index, index + 1)
                break
            }
        }
        if (pedido.produtos.length > 0)
            this.atualizaPedido(pedido)
        this.savePedido(new Pedido(new Registro))
        return carrinho
    }
}