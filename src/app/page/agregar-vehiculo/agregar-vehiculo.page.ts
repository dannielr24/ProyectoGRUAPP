//agregar-vehiculo.page.ts
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/service/api.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-agregar-vehiculo',
  templateUrl: './agregar-vehiculo.page.html',
  styleUrls: ['./agregar-vehiculo.page.scss'],
})
export class AgregarVehiculoPage implements OnInit {
  tokenID: string | null = null;
  email: string = '';
  id_usuario: number = 0;
  patente: string = '';
  marca: string = '';
  modelo: string = '';
  anio: number = 0;
  color: string = '';
  tipo_combustible: string = '';
  archivoImagen: File | null = null;
  userName: string = ''; // Aquí se almacenará el nombre de usuario

  constructor(
    private location: Location,
    private apiservice: ApiService,
    private alertcontroller: AlertController,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private authService : AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
        console.log('Email recibido en agregar-vehiculo:', this.email);
      } else {
        console.warn('Email no encontrado, redirigiendo a principal.');
        this.router.navigate(['/principal']);
      }
    });
  }

  async ngOnInit() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.uid && user.email) {
        this.email = user.email;
        this.userName = await this.authService.getUserNameFromStorage(user.uid) || 'Usuario desconocido';
        console.log('Datos del usuario:', { email: this.email, userName: this.userName });
      } else {
        throw new Error('Usuario no autenticado o datos incompletos');
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      this.router.navigate(['/login']); // Redirige al login
    }
  }   

  // Método para registrar un nuevo vehículo
  async agregarVehiculo() {
    try {
      const user = this.storage.getUserByEmail(this.email);
      if (!user) {
        throw new Error('Usuario no encontrado en el sistema.');
      }
  
      const data = {
        p_id_usuario: user.id_usuario,
        p_vehiculo: this.patente,
        p_marca: this.marca,
        p_modelo: this.modelo,
        p_anio: this.anio,
        p_color: this.color,
        p_tipo_combustible: this.tipo_combustible,
      };
  
      const response = await this.apiservice.agregarVehiculo(data, this.archivoImagen);
      if (response) {
        await this.mostrarAlerta('Éxito', 'Vehículo agregado correctamente.');
        this.router.navigate(['/vehiculos']);
      } else {
        throw new Error('Error al agregar vehículo en el backend.');
      }
    } catch (error) {
      let mensajeError = 'Ocurrió un error inesperado.';
      if (error instanceof Error) {
        mensajeError = error.message;
      }
      await this.mostrarAlerta('Error', mensajeError);
    }
  }       

  // Manejo de la carga de archivo de imagen
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Tipo de archivo no permitido:', file.type);
        this.mostrarAlerta('Error', 'Solo se permiten imágenes en formato JPEG o PNG.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.error('Archivo demasiado grande:', file.size);
        this.mostrarAlerta('Error', 'El tamaño de la imagen no debe superar los 5MB.');
        return;
      }
      this.archivoImagen = file;
    }
  }

  // Alerta personalizada
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertcontroller.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para retroceder a la página anterior
  goBack() {
    this.location.back();
  }
}
