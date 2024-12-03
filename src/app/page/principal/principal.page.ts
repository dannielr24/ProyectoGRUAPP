//principal.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { StorageService } from 'src/app/service/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppComponent } from 'src/app/app.component';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  uid: string = ''; // El UID debería ser dinámico, lo obtendremos de AuthService
  userName: string = ''; 
  email: string = '';
  vehiculos: any[]=[];

  user = {
    email: '',
    userName: ''
  };
  
  constructor(
    private firebase: FirebaseService, 
    private router: Router, 
    private activate: ActivatedRoute, 
    private storage: StorageService,
    private appComponent: AppComponent, 
    private authService: AuthService, 
    private alertController: AlertController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      console.log('Usuario recuperado desde localStorage:', this.user);
    } else {
      console.error('No se encontró el usuario en localStorage');
    }
  }    

  // Método para cerrar sesión
  logout() {
    this.appComponent.confirmLogout();  // Método del componente AppComponent para confirmar y cerrar sesión
  }

  // Método para registrar vehículo
  async agregarVehiculo() {
    const navigationExtras: NavigationExtras = {
      queryParams: { email: this.user.email }
    };
    this.router.navigate(['/agregar-vehiculo'], navigationExtras);
  }
  
  // Método para obtener vehículos
  async obtenerVehiculos() {
    let dataStorage = await this.storage.obtenerStorage();
    const vehiculos = await this.apiService.obtenerVehiculo
  }

  // Método para navegar a otras páginas
  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  // Método para regresar a la página anterior
  goBack() {
    this.router.navigate(['/home']);  // Redirige a la página de inicio si hay un error
  }
}