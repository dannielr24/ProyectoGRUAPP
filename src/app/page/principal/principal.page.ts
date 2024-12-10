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
  pass: number = 0;
  valor: number = 0;
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
  ) {
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'];
      this.pass = params['password'];
      this.valor = params['valor'];
      console.log('mail',this.email);
    });
  }

  ngOnInit() {
    this.user = this.storage.getUserData(); // O usa AuthService si centralizas
    console.log('Usuario en principal:', this.user);
  }
               

  // Método para cerrar sesión
  logout() {
    this.appComponent.confirmLogout();  // Método del componente AppComponent para confirmar y cerrar sesión
  }

  // Método para registrar vehículo
  async agregarVehiculo() {
    const navigationExtras: NavigationExtras = {
      queryParams: { email: this.email }
    };
    this.router.navigate(['/agregar-vehiculo'], navigationExtras);
  }

  async cargarUsuario() {
    const dataStorage = await this.storage.obtenerStorage();
    if (dataStorage && dataStorage.length > 0) {
      const token = dataStorage[0]?.token;
      this.email = dataStorage[0]?.email || '';
      console.log('Email cargado:', this.email);
  
      if (token) {
        const req = await this.apiService.obtenerUsuario({
            p_correo: this.email,
            token: token
        });
  
        console.log('Respuesta de la API:', req);
        if (req && req.length > 0) {
          this.usuario = req;
          console.log('Usuario cargado:', this.usuario);
        } else {
          console.warn('No se encontraron datos para el usuario');
          this.usuario = [];
        }
      } else {
        console.error('Token no disponible en el almacenamiento');
      }
    } else {
      console.error('No hay datos de almacenamiento disponibles');
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

  async popAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
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