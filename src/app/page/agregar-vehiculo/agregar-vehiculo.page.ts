//agregar-vehiculo.page.ts
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/service/api.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
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
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private authService : AuthService,
    private activate: ActivatedRoute
  ) {
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log(this.email)
    })
  }

  email: string = '';
  id_usuario: number = 0;
  patente: string = '';
  marca: string = '';
  modelo: string = '';
  anio: number = 0;
  color: string = '';
  tipo_combustible: string = '';
  token: string = '';
  archivoImagen: File | null = null;
  usuario: UserModel[]=[];

  ngOnInit() {
    this.usuario = this.authService.getAuthenticatedUser(); // Obtener usuario autenticado desde AuthService
    if (!this.usuario) {
      this.router.navigateByUrl('/login');  // Redirigir si no hay sesión activa
    } else {
      console.log('Usuario encontrado:', this.usuario);
    }
  }     

  // Método para registrar un nuevo vehículo
  async agregarVehiculo() {
    try {
      const dataStorage = await this.storage.obtenerStorage();
      console.log('Datos de storage:', dataStorage);
  
      if (!dataStorage?.tkon || !this.archivoImagen) {
        this.popAlert('Error', 'Por favor, completa todos los campos y selecciona una imagen.');
        return;
      }
  
      // Verificación de que todos los campos del vehículo están completos
      if (!this.patente || !this.marca || !this.modelo || !this.anio || !this.color || !this.tipo_combustible) {
        this.popAlert('Error', 'Por favor, completa todos los campos del vehículo.');
        return;
      }
  
      if (!this.usuario?.[0]?.id_usuario) {
        this.popAlert('Error', 'El usuario no está configurado correctamente.');
        return;
      }
  
      const request = await this.apiservice.agregarVehiculo(
        {
          p_id_usuario: this.usuario[0].id_usuario,
          p_patente: this.patente,
          p_marca: this.marca,
          p_modelo: this.modelo,
          p_anio: this.anio,
          p_color: this.color,
          p_tipo_combustible: this.tipo_combustible,
          token: dataStorage.tkon,
        },
        this.archivoImagen
      );
      console.log('Respuesta del API agregarVehiculo:', request);
      this.router.navigateByUrl('principal');
    } catch (error) {
      console.error('Error en agregarVehiculo:', error);
      this.popAlert('Error', 'Hubo un problema al registrar el vehículo.');
    }
  }        

  // Manejo de la carga de archivo de imagen
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
      console.log('Imagen seleccionada:', this.archivoImagen);
    } else {
      console.log('No se seleccionó imagen');
    }
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
        console.error("DATA INICIO USUARIO", this.usuario);
    } 

  // Alerta personalizada
  async popAlert(header: string, message: string) {
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
