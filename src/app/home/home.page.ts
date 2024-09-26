import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: any;

  constructor(private router: Router, private menu: MenuController, private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }

  getAvatar() {
    return this.usuarioService.getAvatar();
  }

  getSaludo() {
    return this.usuarioService.getSaludo();
  }

  goToAccount(page: String) {
    this.router.navigate([`/${page}`])
  }

  goToPage(page: string){
    this.router.navigate([page]);
  }

  navigateToService() {
    this.router.navigate(['/mapa']);
  }

  openMenu() {
    this.menu.open(); // Abre el menú
  }

  buscarUbicacion(event: any) {
    console.log('Usuario buscó:', event.detail.value);
  }

  seleccionarOpcionViaje(opcion: string) {
    console.log('Opción seleccionada:', opcion);
  }

  solicitarViaje() {
    console.log('Solicituda de viaje enviada');
  }

  solicitarGrua() {
    console.log('Solicitud de grúa enviada');
  }
  
}
