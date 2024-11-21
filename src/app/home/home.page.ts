import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: any;
  userName: string = '';

  constructor(
    private router: Router, 
    private menu: MenuController, 
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.printCurrentPosition();
  }

  async printCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);
    } catch (error) {
      console.error('Error getting location', error);
    }
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
    if (opcion === 'Auto') {
      this.router.navigate(['/ruta-auto']);
    } else if (opcion === 'Moto') {
      this.router.navigate(['/ruta-moto']);
    }
  }

  solicitarViaje() {
    console.log('Solicituda de viaje enviada');
    this.router.navigate(['/mapa']);
  }

  solicitarGrua() {
    console.log('Solicitud de grúa enviada');
    this.router.navigate(['/solicitar-grua']);
  }  

  verDetalleViaje() {
    this.router.navigate(['/detalle-viaje']);
  }
}
