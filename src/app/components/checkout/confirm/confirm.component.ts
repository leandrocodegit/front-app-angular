import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router'; 
import { User } from 'src/app/models/User';
import { Usuario } from 'src/app/models/usuario/Usuario';
import { EnderecoService } from 'src/app/services/EnderecoService';
import { LoginService } from 'src/app/services/LoginService';
import { RouterService } from 'src/app/services/RouterService';
import { UsuarioService } from 'src/app/services/usuario/UsuarioService';

@Component({
  selector: 'spa-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
 
  usuario:Usuario = {} as Usuario
  user: User = {} as User 
 
  constructor( 
    private usuarioService: UsuarioService, 
    private _bottomSheet: MatBottomSheet,
    private router: Router 
  ) { }

  ngOnInit(): void {
      
    if (localStorage.getItem('isLogado') === 'true') {  
      if (localStorage.getItem('usuario') != null)
      this.usuario = JSON.parse(localStorage.getItem('usuario')!) 
    } 
  }

  alterar(){
    this._bottomSheet.dismiss(ConfirmComponent)
    localStorage.setItem('cadastro', 'pendente')
    this.router.navigate(['/cadastro'])
  }
}
