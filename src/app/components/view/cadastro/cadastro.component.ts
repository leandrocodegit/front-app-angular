import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { EnderecoService } from 'src/app/services/EnderecoService';
import { RouterService } from 'src/app/services/RouterService';
import { Usuario } from 'src/app/models/usuario/Usuario';
import { UsuarioService } from 'src/app/services/usuario/UsuarioService';
import { Endereco } from 'src/app/models/usuario/Endereco';
import { ConfirmComponent } from '../../checkout/confirm/confirm.component';

@Component({
  selector: 'spa-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit, OnDestroy {

  endereco = {} as Endereco
  usuario: Usuario = new Usuario
  user: User = {} as User
  nameButton = 'Continuar'
  color = "black"
  isOpen = false
  isOpens = true

  constructor(
    private enderecoService: EnderecoService,
    private usuarioService: UsuarioService,
    private bottomSheet: MatBottomSheet,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('isLogado') === 'true') {

      if (localStorage.getItem('cadastro') != null) {
        if (localStorage.getItem('cadastro') == 'confirmado')
          this.router.navigate(["/pagamento"])
      }


      this.user = JSON.parse(localStorage.getItem('user')!)

      this.usuarioService.buscaUsuario().subscribe(result => {
        this.usuario = result
        this.endereco = result.endereco_principal
        localStorage.getItem('isLogado')
        localStorage.setItem('usuario', JSON.stringify(result))
        console.log('Cadastro usuario ' + JSON.stringify(result))
      }, () => {
        this.endereco = new Endereco
        console.log('Erro cadastro not found')
      })
    } else {
      this.router.navigate(["/login"])
    }
  }
  ngOnDestroy(): void {
    this.bottomSheet.dismiss()
  }

  buscaCep(cep: string) { 
    if (cep.length == 8)
      this.enderecoService.findAddressByCep(cep).subscribe(result => {
        this.usuario.endereco_principal = this.endereco = result
        this.usuario.endereco_principal.cep = this.usuario.endereco_principal.cep?.replace("-", "")
      })
  }

  enviar() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario))
    if (this.nameButton == "Confirmar dados") {
      this.usuarioService.atualizarUsuario(this.usuario).subscribe(result => {
        localStorage.setItem('cadastro', 'confirmado')        
        this.nameButton = "Continuar"
        this.color = "black"
        this.bottomSheet.dismiss()
      })
      this.router.navigate(["/pagamento"])
    } else this.openSheet()

  }

  openSheet(): void { 
    this.bottomSheet.open(ConfirmComponent)
    this.nameButton = "Confirmar dados"
    this.color = "#664a7c" 
  }


}
