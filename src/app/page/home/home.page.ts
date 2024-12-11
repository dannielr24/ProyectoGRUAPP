import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { Geolocation } from '@capacitor/geolocation';
import { FirebaseService } from '../../service/firebase.service';
import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: any;
  userName: string = '';
  tokenID: string = '';  // Asegúrate de tener el tokenID

  constructor(
    private router: Router, 
    private menu: MenuController, 
    private usuarioService: UsuarioService,
    private firebaseService: FirebaseService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    const isLoggedIn = await this.firebaseService.isUserLoggedIn();
    if (!isLoggedIn) {
      console.log('Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
      return;
    }
  
    const uid = await this.storageService.getItem('uid');
    console.log('UID recuperado:', uid);
  
    if (uid) {
      try {
        this.usuario = await this.usuarioService.getUsuario(uid);
        console.log('Usuario autenticado:', this.usuario);
  
        // Asegúrate de que el nombre del usuario se recupera correctamente
        const storedUserName = await this.storageService.getItem('userName');
        this.userName = storedUserName || 'Usuario';
        console.log('Nombre de usuario recuperado:', this.userName);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        this.router.navigate(['/login']);
      }
    } else {
      console.warn('UID no encontrado, redirigiendo a login');
      this.router.navigate(['/login']);
    }
  }  

  // Función para obtener la posición actual del usuario
  async printCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);
    } catch (error) {
      console.error('Error getting location', error);
    }
  }

  // Función para obtener el avatar del usuario
  getAvatar() {
    return this.usuarioService.getAvatar();
  }

  // Función para obtener un saludo personalizado
  getSaludo() {
    return this.usuarioService.getSaludo();
  }

  // Función para navegar a una página de cuenta
  goToAccount(page: string) {
    this.router.navigate([`/${page}`]);
  }

  // Función para navegar a una página en general
  goToPage(page: string) {
    this.router.navigate([page]);
  }

  // Navegar al mapa
  navigateToService() {
    this.router.navigate(['/mapa']);
  }

  // Abrir el menú lateral
  openMenu() {
    this.menu.open(); // Abre el menú
  }

  // Función para buscar ubicación
  buscarUbicacion(event: any) {
    console.log('Usuario buscó:', event.detail.value);
  }

  // Función para seleccionar una opción de viaje
  seleccionarOpcionViaje(opcion: string) {
    console.log('Opción seleccionada:', opcion);
    if (opcion === 'Auto') {
      this.router.navigate(['/ruta-auto']);
    } else if (opcion === 'Moto') {
      this.router.navigate(['/ruta-moto']);
    }
  }

  // Función para solicitar un viaje
  solicitarViaje() {
    console.log('Solicitud de viaje enviada');
    this.router.navigate(['/mapa']);
  }

  // Función para solicitar una grúa
  solicitarGrua() {
    console.log('Solicitud de grúa enviada');
    this.router.navigate(['/solicitar-grua']);
  }

  // Ver detalles del viaje
  verDetalleViaje() {
    this.router.navigate(['/detalle-viaje']);
  }
}
