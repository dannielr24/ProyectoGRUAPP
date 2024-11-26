import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/service/api.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-agregar-vehiculo',
  templateUrl: './agregar-vehiculo.page.html',
  styleUrls: ['./agregar-vehiculo.page.scss'],
})
export class AgregarVehiculoPage implements OnInit {

  constructor( 
    private location: Location,
    private apiservice: ApiService,
    private alertcontroller: AlertController,
    private activate: ActivatedRoute, 
    private storage: StorageService, 
    private router: Router,
    private route: ActivatedRoute 
  ) { 
    this.activate.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
        console.log('Email recibido en agregar-vehiculo:', this.email);
      } else {
        console.warn('Email no encontrado, redirigiendo a principal.');
        this.router.navigate(['/principal']); // Redirigir si no hay email
      }
    });
        
  }

  user: { name: string; email: string } = { name: '', email: '' };
  usuario: UserModel[] = [];
  email: string = "";
  id_usuario: number = 0;
  patente: string = "";
  marca: string = "";
  modelo: string = "";
  anio: number = 0;
  color: string = "";
  tipo_combustible: string = "";
  token: string = '';
  password: string = '';
  archivoImagen: File | null = null; // Imagen que el usuario puede subir

  ngOnInit() {
    // Recupera el email de los queryParams
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        console.log('Email recibido en agregar-vehiculo:', params['email']);
        this.email = params['email']; // Aquí guardas el email para usarlo en tu lógica
      } else {
        console.warn('Email no encontrado, redirigiendo a principal.');
        this.router.navigate(['/principal']); // Redirigir si no hay email
      }
    });
  }

   // Método para registrar un nuevo usuario
   async registrarVehiculo() {
    try {
      // Validar que todos los campos requeridos estén completos
      if (!this.patente || !this.marca || !this.modelo || !this.anio || !this.color || !this.tipo_combustible) {
        await this.popAlert(); // Mostrar una alerta si falta algún campo
        return;
      }
  
      // Obtener datos del almacenamiento
      const dataStorage = await this.storage.obtenerStorage();
  
      // Verificar si hay una imagen para cargar
      if (this.archivoImagen) {
        const request = await this.apiservice.agregarVehiculo(
          {
            p_id_usuario: this.usuario[0].id_usuario,
            p_patente: this.patente,
            p_marca: this.marca,
            p_modelo: this.modelo,
            p_anio: this.anio,
            p_color: this.color,
            p_tipo_combustible: this.tipo_combustible,
            token: dataStorage[0].token,
          },
          this.archivoImagen
        );
      }
  
      // Navegar a la página principal después de registrar el vehículo
      this.router.navigateByUrl('/principal');
    } catch (error) {
      // Mostrar un mensaje de error en caso de fallo
      await this.popAlert();
      console.error('Error al registrar el vehículo', error);
    }
  }
  

  // Manejo de la carga de archivo de imagen
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }

  // Alerta de error de registro
  async popAlert() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'Usuario o Contraseña incorrecta',
      buttons: ['Ok'],
    });
    await alert.present();
  }

  async cargarUsuario() {
    let dataStorage = await this.storage.obtenerStorage();
    const req = await this.apiservice.obtenerUsuario(
      {
        p_correo: this.email,
        token: dataStorage[0].token
      }
    );
    this.usuario = req; 
    console.log("DATA INICIO USUARIO", this.usuario);
  }

  // Método para retroceder a la página anterior
  goBack() {
    this.location.back();
  }

}
