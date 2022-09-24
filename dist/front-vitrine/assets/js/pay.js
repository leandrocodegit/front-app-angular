
let mercadopago = new MercadoPago("TEST-806f26a3-e8fc-4873-ad2a-38402d3505d5");
let obJectPay = new Object
let payer = new Object
let identification = new Object
var isReload = false;
let isInstance = false;

function getToken() {
    return obJectPay
}

function getAuth() {
    console.log('Init');
    return payer
}

function loadCardForm() {
    if (isInstance == false) {
        const productCost = document.getElementById('amount').value;
        const productDescription = document.getElementById('product-description').innerText;


        let cardForm = mercadopago.cardForm({
            amount: productCost,
            autoMount: true,
            form: {
                id: "form-checkout",
                cardholderName: {
                    id: "form-checkout__cardholderName",
                    placeholder: "Holder name",
                },
                cardholderEmail: {
                    id: "form-checkout__cardholderEmail",
                    placeholder: "E-mail",
                },
                cardNumber: {
                    id: "form-checkout__cardNumber",
                    placeholder: "Card number",
                },
                cardExpirationMonth: {
                    id: "form-checkout__cardExpirationMonth",
                    placeholder: "MM",
                },
                cardExpirationYear: {
                    id: "form-checkout__cardExpirationYear",
                    placeholder: "YY",
                },
                securityCode: {
                    id: "form-checkout__securityCode",
                    placeholder: "Security code",
                },
                installments: {
                    id: "form-checkout__installments",
                    placeholder: "Installments",
                },
                identificationType: {
                    id: "form-checkout__identificationType",
                },
                identificationNumber: {
                    id: "form-checkout__identificationNumber",
                    placeholder: "Identification number",
                },
                issuer: {
                    id: "form-checkout__issuer",
                    placeholder: "Issuer",
                },
            },
            callbacks: {
                onFormMounted: error => {
                },

            },
        });
        isInstance = true
        $('#form-checkout__installments').empty();
    }
};

$("#form-checkout__installments").change(function () {
    $("#total").val($("#form-checkout__installments").name());
});

function selectUpdateInstallments(card) {
    let unitPrice = document.getElementById('unit-price').value;

    if($("#form-checkout__installments").val() == null){
    const parcelas = mercadopago.getInstallments({
        amount: unitPrice,
        locale: 'pt-BR',
        bin: card,
        processingMode: 'aggregator'
    })
    var x = Promise.resolve(parcelas);
    var xx = Promise.resolve(x);
    xx.then(function (v) {
        $('#form-checkout__installments').empty();
        $('#form-checkout__installments').append(`<option name='0'value='0' disabled selected>Selecione as parcelas</option>`);
        for (var i = 0; i < v.length; i++) {
            for (var j = 0; j < v[i].payer_costs.length; j++) {
                var instal = v[i].payer_costs[j];
                var valor = instal.installment_amount;
                var total = instal.total_amount;
                var parcela = valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                var totalAmount = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

                $('#form-checkout__installments').append(`<option name='${totalAmount}'
value='${instal.installments}'>${instal.installments + "X " + parcela + "\t\t(" + totalAmount + ")"}</option>`);
            }
        }
    });
}
}

function selectUpdateIssuer() {
    let card = $("#numeroCartao").val().replaceAll(" ", "").trim();
    let result = card;
    if (card.length > 5 && card.length < 7 || card.length > 14) {
        selectUpdateInstallments(card);
        if (card.includes(" ", 0) == false) {
            result = card.substring(0, 6);
            const paymentMethods = mercadopago.getPaymentMethods({ bin: result });
            var x = Promise.resolve(paymentMethods);
            var xx = Promise.resolve(x);
            xx.then(function (v) {
                $('#form-checkout__issuer').empty();
                $("#bandeira").attr("src", v.results[0].secure_thumbnail);
                $('#form-checkout__issuer').append(`<option name='${v.results[0].issuer.id}'
value='${v.results[0].id}'>${v.results[0].issuer.name}</option>`);
                obJectPay.issuer_id = v.results[0].issuer.id;
                obJectPay.payment_method_id = v.results[0].id;
                if (v.results[0].issuer.id == 18) {
                    $("#form-checkout__securityCode").attr("pattern", "[0-9]{4}");
                }
                else {
                    $("#form-checkout__securityCode").attr("pattern", "[0-9]{3}");
                }
            });
        }
    }
}
function atualizarToken() {
    let cartao = $("#numeroCartao").val().replaceAll(" ", "").trim();
    let cardholderName = $("#form-checkout__cardholderName").val();
    let cardExpirationMonth = $("#form-checkout__cardExpirationMonth").val();
    let cardExpirationYear = $("#form-checkout__cardExpirationYear").val();
    let securityCode = $("#form-checkout__securityCode").val();
    let identificationType = 'CPF';
    let identificationNumber = $("#form-checkout__identificationNumber").val();


    if (getValid()) {

        const card = mercadopago.createCardToken({
            cardNumber: cartao,
            cardholderName,
            cardExpirationMonth,
            cardExpirationYear,
            securityCode,
            identificationType,
            identificationNumber,
        });

        var original = Promise.resolve(card);
        var cast = Promise.resolve(original);
        cast.then(function (v) {
            $("#MPHiddenInputToken").val(v.id);

            identification.type = identificationType
            identification.number = identificationNumber

            payer.email = $("#form-checkout__cardholderEmail").val()
            payer.identification = identification

            obJectPay.token = v.id;
            obJectPay.transaction_amount = $("#unit-price").val()
            obJectPay.installments = $("#form-checkout__installments").val()
            console.log("installments pay.js:  " + $("#form-checkout__installments").val()) 
            obJectPay.payer = payer
            obJectPay.numero_pedido = 0 


        });
        selectUpdateIssuer();
    }
    else {
        obJectPay.token = null;
    }
    return obJectPay
}

// Handle transitions
function showCheckout() {
    $('.container__cart').fadeOut(500);
    setTimeout(() => {
        $('.container__payment').show(500).fadeIn();
    }, 500);
};

function showCart() {
    $('.container__payment').fadeOut(500);
    setTimeout(() => { $('.container__cart').show(500).fadeIn(); }, 500);
};

function getValid() { 
    let cardNumber = $("#numeroCartao").val().replaceAll(" ", "");
    let cardholderName = $("#form-checkout__cardholderName").val();
    let cardExpirationMonth = $("#form-checkout__cardExpirationMonth").val();
    let cardExpirationYear = $("#form-checkout__cardExpirationYear").val();
    let securityCode = $("#form-checkout__securityCode").val();


    if (cardNumber.length > 14 &&
        cardholderName.length > 1 &&
        cardExpirationMonth.length == 2 &&
        cardExpirationYear.length == 2 &&
        securityCode.length > 2) {            
        return true;
    }

    return false;
}

function focus(){
    $("#form-checkout__installments").focus(); 
}




