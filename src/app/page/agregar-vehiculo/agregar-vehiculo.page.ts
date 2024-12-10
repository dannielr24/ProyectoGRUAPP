import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/service/api.service';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel } from '../models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-agregar-vehiculo',
  templateUrl: './agregar-vehiculo.page.html',
  styleUrls: ['./agregar-vehiculo.page.scss'],
})
export class AgregarVehiculoPage implements OnInit {

  constructor(
    private location: Location,
    private apiService: ApiService,
    private alertController: AlertController,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log(this.email);
    });
  }

  email: string = '';
  id_usuario: number = 0;
  patente: string = '';
  marca: string = '';
  modelo: string = '';
  anio: number = 0;
  color: string = '';
  tipo_combustible: string = '';
  currentYear = new Date().getFullYear();

  usuario: UserModel = {
    anio: 0,
    calificacion_promedio: 0,
    capacidad_pasajeros: 0,
    color: '',
    correo_electronico: '',
    id_usuario: 0,
    id_vehiculo: 0,
    id: 0,
    imagen_usuario: '',
    imagen_vehiculo: '',
    marca: '',
    modelo: '',
    nombre: '',
    nombre_proyecto: '',
    patente: '',
    telefono: '',
    tipo_combustible: '',
    email: '',
    uid: '',
    displayName: ''
  };
   
  token: string = '';
  
  archivoImagen: File | null = null;

  async ngOnInit() {
    try {
      // Primero cargar datos básicos del usuario
      const userData = this.storage.getUserData();
      console.log('Datos iniciales del usuario:', userData);
  
      if (!userData) {
        throw new Error('No se encontraron datos del usuario');
      }
  
      // Obtener token
      const token = await this.storage.getToken();
      console.log('Token al iniciar:', token);
  
      if (!token) {
        throw new Error('No se encontró el token');
      }
  
      // Obtener datos completos del usuario desde la API
      const userResponse = await this.apiService.obtenerUsuario({
        p_correo: userData.email,
        token: token
      });
  
      console.log('Respuesta de obtenerUsuario:', userResponse);
  
      if (userResponse && userResponse.length > 0) {
        this.usuario = {
          ...this.usuario,
          ...userResponse[0],
          email: userData.email,
          uid: userData.uid,
          displayName: userData.displayName
        };
        console.log('Usuario completo cargado:', this.usuario);
      } else {
        // Si no existe el usuario en la base de datos, crearlo
        const nuevoUsuario = {
          p_nombre: userData.displayName || 'Usuario',
          p_correo_electronico: userData.email,
          p_telefono: '',
          token: token
        };
  
        const createResponse = await this.apiService.agregarUsuario(nuevoUsuario, null);
        console.log('Usuario creado:', createResponse);
        
        // Volver a obtener el usuario para tener el id_usuario
        const userDataUpdated = await this.apiService.obtenerUsuario({
          p_correo: userData.email,
          token: token
        });
  
        if (userDataUpdated && userDataUpdated.length > 0) {
          this.usuario = {
            ...this.usuario,
            ...userDataUpdated[0],
            email: userData.email,
            uid: userData.uid,
            displayName: userData.displayName
          };
        }
      }
  
      if (!this.usuario.id_usuario) {
        throw new Error('No se pudo obtener el ID de usuario');
      }
  
    } catch (error: unknown) {
      console.error('Error en ngOnInit:', error);
      let mensajeError = 'Error al cargar los datos del usuario.';
  
      if (error instanceof Error) {
        mensajeError += ' ' + error.message;
      } else if (typeof error === 'string') {
        mensajeError += ' ' + error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        mensajeError += ' ' + error.message;
      }
  
      await this.popAlert('Error', mensajeError);
    }
  }     

  // Método para registrar un nuevo vehículo
  async agregarVehiculo() {
    try {
      // Debug de datos antes de enviar
      console.log('Usuario actual:', this.usuario);
      console.log('Datos del formulario:', {
        patente: this.patente,
        marca: this.marca,
        modelo: this.modelo,
        anio: this.anio,
        color: this.color,
        tipo_combustible: this.tipo_combustible
      });
  
      // Validaciones
      if (!this.usuario || !this.usuario.id_usuario) {
        await this.popAlert('Error', 'No se ha cargado correctamente la información del usuario');
        return;
      }
  
      if (!this.patente || !this.marca || !this.modelo || !this.anio || !this.color || !this.tipo_combustible) {
        await this.popAlert('Error', 'Por favor complete todos los campos');
        return;
      }
  
      if (!this.archivoImagen) {
        await this.popAlert('Error', 'Por favor seleccione una imagen del vehículo');
        return;
      }
  
      // Obtener token
      const token = await this.storage.getToken();
      console.log('Token obtenido:', token);
  
      if (!token) {
        await this.popAlert('Error', 'No se encontró el token de autenticación');
        return;
      }
  
      const vehiculoData = {
        p_id_usuario: this.usuario.id_usuario,
        p_patente: this.patente.toUpperCase(),
        p_marca: this.marca,
        p_modelo: this.modelo,
        p_anio: this.anio,
        p_color: this.color,
        p_tipo_combustible: this.tipo_combustible,
        token: token
      };
  
      console.log('Datos a enviar:', vehiculoData);
  
      const response = await this.apiService.agregarVehiculo(vehiculoData, this.archivoImagen);
      console.log('Respuesta del servidor:', response);
  
      await this.popAlert('Éxito', 'Vehículo agregado correctamente');
      this.router.navigate(['/principal']);
  
    } catch (error: any) {
      console.error('Error completo:', error);
      
      let mensajeError = 'Error al agregar el vehículo';
      if (error.error && error.error.message) {
        mensajeError = error.error.message;
      } else if (error.message) {
        mensajeError = error.message;
      }
      
      await this.popAlert('Error', mensajeError);
    }
  }        

  // Manejo de la carga de archivo de imagen
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
      console.log('Archivo seleccionado:', this.archivoImagen?.name);
    }
  }  

  // Cargar usuario desde el almacenamiento
  async cargarUsuario() {
    try {
      const dataStorage = await this.storage.obtenerStorage();
      console.log('Datos completos del storage:', dataStorage);
  
      // Verificar la estructura de dataStorage
      if (!dataStorage || dataStorage.length === 0) {
        console.error('No hay datos en el storage');
        await this.popAlert('Error', 'No se encontraron datos de usuario');
        return;
      }
  
      // Asegúrate de que el storage tenga la estructura esperada
      const token = dataStorage[0]?.token;
      const email = dataStorage[0]?.email;
  
      console.log('Token recuperado:', token);
      console.log('Email recuperado:', email);
  
      if (!token || !email) {
        await this.popAlert('Error', 'Datos de usuario incompletos');
        return;
      }
  
      try {
        const req = await this.apiService.obtenerUsuario({
          p_correo: email,
          token: token
        });
  
        console.log('Respuesta completa de obtenerUsuario:', req);
  
        if (req && req.length > 0) {
          this.usuario = req[0];
          console.log('Usuario cargado exitosamente:', this.usuario);
        } else {
          console.warn('No se encontraron datos de usuario');
          await this.popAlert('Error', 'No se encontraron datos de usuario');
        }
      } catch (apiError) {
        console.error('Error al obtener usuario desde la API:', apiError);
        await this.popAlert('Error', 'No se pudo obtener la información del usuario');
      }
    } catch (error) {
      console.error('Error general en cargarUsuario:', error);
      await this.popAlert('Error', 'Ocurrió un error al cargar el usuario');
    }
  } 

  // Alerta personalizada
  async popAlert(header: string, message: string) {
    const alert = await this.alertController.create({
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
