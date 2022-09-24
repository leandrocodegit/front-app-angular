import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseCheckout } from 'src/app/models/checkouts/ResponseCheckout';
import { PaymentService } from 'src/app/services/PaymentService';

@Component({
  selector: 'spa-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  reposnsePay: ResponseCheckout = {} as ResponseCheckout

  constructor(
    private paymentService: PaymentService,
    private route: Router) {

  }
  ngOnInit(): void {
  }

  getResponse(){
    this.reposnsePay = this.paymentService.responsePay
  }

}
