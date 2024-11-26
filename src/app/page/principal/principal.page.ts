import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { StorageService } from 'src/app/service/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppComponent } from 'src/app/app.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  uid: string = ''; // El UID debería ser dinámico, lo obtendremos de AuthService
  userName: string = ''; 
  email: string = '';

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
    private alertController: AlertController
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
  async registrarVehiculo() {
  if (!this.user.email) {
    console.error("Email no disponible, no se puede registrar vehículo");
    // Mostrar una alerta al usuario si el email no está disponible
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo obtener el email del usuario. Por favor, inicie sesión nuevamente.',
      buttons: ['OK']
    });
    await alert.present();
    return;
  }
 
  console.log("Registrando vehículo con email:", this.user.email);
  this.router.navigate(['/agregar-vehiculo'], {
    queryParams: { email: this.user.email }
  });
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
