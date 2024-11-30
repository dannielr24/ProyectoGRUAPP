import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/service/storage.service';  // Importa StorageService

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  usuario: any;
  showTabBar: boolean = true;

  constructor(
    private router: Router,
    private location: Location,
    private usuarioService: UsuarioService,
    private storageService: StorageService  // Inyecta StorageService
  ) {}

  async ngOnInit() {
    // Recupera el uid desde el storage
    const uid = await this.storageService.get('uid');
  
    if (uid) {
      // Pasa el uid al método getUsuario
      this.usuario = await this.usuarioService.getUsuario(uid);
    } else {
      console.warn('UID no encontrado');
      this.router.navigate(['/login']); // Redirige si no se encuentra el UID
    }

    // Suscríbete a los eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showTabBar = this.router.url !== '/login';
      }
    });
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
