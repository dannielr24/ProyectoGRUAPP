import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  usuario: any;
  showTabBar: boolean = true;

  constructor(private router: Router, private location: Location, private usuarioService: UsuarioService) {}

  ngOnInit() {
    // Obtén los datos del usuario desde el servicio
    this.usuario = this.usuarioService.getUsuario();

    // Suscríbete a los eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showTabBar = this.router.url !== '/login';
      }
    })
  }

  getAvatar() {
    return this.usuarioService.getAvatar();
  }

  getSaludo() {
    return this.usuarioService.getSaludo();
  }

  goToAccount(page: string) {
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }

  goToPage(page: string) {
    this.router.navigate([page]);
  }
}
