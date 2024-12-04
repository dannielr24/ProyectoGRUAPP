//principal.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { StorageService } from 'src/app/service/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppComponent } from 'src/app/app.component';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { UserModel } from '../models/user.model';

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
  usuario: UserModel[]=[];

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

  async ngOnInit() {
    await this.loadUserData(); // Asegúrate de que email esté disponible
    if (this.email) {
      await this.cargarUsuario();
    } else {
      console.error("Email no encontrado. No se puede cargar el usuario.");
    }
  }  
  
  async loadUserData() {
    try {
      const currentUserString = localStorage.getItem('currentUser');
      if (currentUserString) {
        const userData = JSON.parse(currentUserString);
        if (userData?.userName && userData?.email) {
          this.userName = userData.userName;
          this.email = userData.email;
        } else {
          console.error('Estructura de datos inválida:', userData);
        }
      } else {
        console.warn('No se encontró el usuario en localStorage.');
      }
    } catch (e) {
      console.error('Error al analizar datos del usuario:', e);
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

  async cargarUsuario() {
    if (!this.email) {
      console.error("Email no definido. No se puede cargar el usuario.");
      return;
    }
  
    try {
      let dataStorage = await this.storage.obtenerStorage();
      if (!dataStorage || dataStorage.length === 0 || !dataStorage[0].token) {
        console.error("Error: No se encontró un token válido en el almacenamiento.");
        await this.mostrarAlertaError("No se encontró un token válido. Intenta iniciar sesión nuevamente.");
        return;
      }
  
      const req = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: dataStorage[0].token,
      });
  
      if (req && req.length > 0) {
        this.usuario = req;
        console.log("Usuario cargado:", this.usuario);
      } else {
        console.warn("No se encontró usuario.");
        this.usuario = []; // Limpia el array si no hay datos
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  }      

  async cargarViajes() {
    if (!this.usuario || this.usuario.length === 0) {
      console.error("Usuario no cargado. Llama a cargarUsuario primero.");
      return;
    }
  
    try {
      let dataStorage = await this.storage.obtenerStorage();
      const viajes = await this.apiService.obtenerViaje({
        p_id_usuario: this.usuario[0].id_usuario,
        token: dataStorage[0].token,
      });
  
      if (viajes.data.length > 0) {
        const navigationExtras: NavigationExtras = { queryParams: { email: this.email } };
        this.router.navigate(['/ver-viajes'], navigationExtras);
      } else {
        this.popAlertNoVehiculos();
      }
    } catch (error) {
      console.error("Error al cargar viajes:", error);
    }
  }    
  
  // Método para obtener vehículos
  async obtenerVehiculos() {
    if (!this.usuario || this.usuario.length === 0) {
      console.error("Usuario no cargado. Llama a cargarUsuario primero.");
      return;
    }
  
    let dataStorage = await this.storage.obtenerStorage();
    const vehiculos = await this.apiService.obtenerVehiculo({
      p_id: this.usuario[0].id_usuario,
      token: dataStorage[0].token,
    });
  
    console.log("DATA Obt. v Principal", vehiculos);
    if (vehiculos.data.length > 0) {
      const navigationExtras: NavigationExtras = { queryParams: { email: this.email } };
      this.router.navigate(['/listado-vehiculos'], navigationExtras);
    } else {
      this.popAlertNoVehiculos();
    }
  }  

  async agregarViajes() {
    if (!this.usuario || this.usuario.length === 0) {
      console.error("Usuario no cargado. Llama a cargarUsuario primero.");
      return;
    }
  
    let dataStorage = await this.storage.obtenerStorage();
    const vehiculos = await this.apiService.obtenerVehiculo({
      p_id: this.usuario[0].id_usuario,
      token: dataStorage[0].token,
    });
  
    if (vehiculos.data.length > 0) {
      const navigationExtras: NavigationExtras = { queryParams: { email: this.email } };
      this.router.navigate(['/agregar-viaje'], navigationExtras);
    } else {
      this.popAlertNoViajes();
    }
  }  

  async actualizarViaje() {
    let dataStorage = await this.storage.obtenerStorage();
    await this.apiService.actualizarViaje(
      {
        p_id_estado: 3,
        p_id: 64,
        token: dataStorage[0].token
      }
    ) 
  }

  // Método para navegar a otras páginas
  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['ok']
    });
    await alert.present();
  }  

  async popAlertNoVehiculos() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: "Sin vehículos registrados",
      buttons: ['ok']
    });
    await alert.present();
  }

  async popAlertNoViajes() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: "Sin viajes registrados",
      buttons: ['ok']
    });
    await alert.present();
  }

  // Método para regresar a la página anterior
  goBack() {
    this.router.navigate(['/home']);  // Redirige a la página de inicio si hay un error
  }
}