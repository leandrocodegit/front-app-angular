import { Component, NgModule, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/AuthService';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { CookiesService } from 'src/app/services/CookiesService';
import { interval, Subscription } from 'rxjs';
import { RouterService } from 'src/app/services/RouterService';


declare var initFacebook: any
declare var parseJwt: any
declare var google: any
declare var login: any
declare var getPayLoad: any


@Component({
  selector: 'spa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  user: User = {}
  interval = {} as any
   

  token = {} as any
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookiesService,
    private routerService: RouterService
  ) { }
  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  ngOnInit() {
    
   // this.cookieService.deleteCookie("fbsr_322371943411039")
    initFacebook()
    this.interval = setInterval(() => {
      this.printCookies();
    }, 3000)

    this.route.params.subscribe(params => {
      var credential = params['credential']
      if (credential != null) {
        localStorage.setItem("user", JSON.stringify(parseJwt(params['credential'])))
        localStorage.setItem("token", credential)
        localStorage.setItem("isLogado", "true")
        this.user = JSON.parse(localStorage.getItem('user')!)
        console.log('User ' + this.user.given_name)
        console.log('User ' + credential)
        this.router.navigate([this.routerService.previosPage])
      }
    })
  }

  sair() {

    console.log('CRSF ' + document.cookie)

  }

  logar() {
    login()
  }

  printCookies() {
    var payload = getPayLoad()
    if (payload != null) {
      this.user = this.user = JSON.parse(payload)
      localStorage.setItem("isLogado", "true")
      localStorage.setItem("user", JSON.stringify(this.user))
      this.router.navigate(["pagamento"])
      console.log(JSON.stringify(this.user))
    }
    console.log('CRSF ' + document.cookie)
  }



}
