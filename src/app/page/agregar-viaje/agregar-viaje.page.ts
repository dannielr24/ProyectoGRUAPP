import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/service/storage.service';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserVehiculo } from '../models/user-vehiculo.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-viaje',
  templateUrl: './agregar-viaje.page.html',
  styleUrls: ['./agregar-viaje.page.scss'],
})
export class AgregarViajePage implements OnInit {
  email: string = "";
  usuario: UserModel[] = [];
  vehiculo: UserVehiculo[] = [];
  vehiculos: any[] = [];
  p_ubicacion_origen: string = '';
  p_ubicacion_destino: string = '';
  p_costo: number | null = null;
  token: string = '';

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private location: Location,
    private storage: StorageService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    try {
      const dataStorage = await this.storage.obtenerStorage();
      console.log('Datos del storage:', dataStorage);

      if (!dataStorage || typeof dataStorage !== 'object' || !dataStorage.email || !dataStorage.token) {
        console.error('Datos de sesión inválidos:', dataStorage);
        await this.mostrarMensaje('Error', 'Datos de sesión inválidos');
        this.router.navigate(['/login']);
        return;
      }

      this.email = dataStorage.email;
      this.token = dataStorage.token;
      await this.cargarUsuario();
      
      if (this.usuario.length > 0 && this.usuario[0].id_usuario) {
        await this.obtenerVehiculos();
      } else {
        throw new Error('No se pudo cargar la información del usuario correctamente');
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      await this.mostrarMensaje('Error', 'Error al cargar datos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      this.router.navigate(['/login']);
    }
  }

  async obtenerVehiculos() {
    try {
      if (!this.usuario || this.usuario.length === 0 || !this.usuario[0].id_usuario) {
        throw new Error('Información de usuario no disponible');
      }
      const userId = this.usuario[0].id_usuario;
      const req = await this.apiService.obtenerVehiculo({
        p_id: userId,
        token: this.token
      });
      if (req && req.data) {
        this.vehiculo = req.data;
        console.log('Vehículos obtenidos:', this.vehiculo);
      } else {
        console.warn('No se encontraron vehículos para el usuario');
        this.vehiculo = [];
      }
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw error;
    }
  }

  async registrarViaje() {
    try {
      console.log('Datos del viaje:', {
        origen: this.p_ubicacion_origen,
        destino: this.p_ubicacion_destino,
        costo: this.p_costo
      });
  
      if (!this.p_ubicacion_origen || !this.p_ubicacion_destino || !this.p_costo) {
        await this.mostrarMensaje('Error', 'Por favor complete todos los campos');
        return;
      }
  
      if (!this.usuario || this.usuario.length === 0 || !this.usuario[0].id_usuario) {
        await this.mostrarMensaje('Error', 'No se encontró información del usuario');
        return;
      }
  
      if (!this.vehiculo || this.vehiculo.length === 0 || !this.vehiculo[0].id_vehiculo) {
        await this.mostrarMensaje('Error', 'No se encontró información del vehículo');
        return;
      }
  
      const datosViaje = {
        p_id_usuario: this.usuario[0].id_usuario,
        p_ubicacion_origen: this.p_ubicacion_origen,
        p_ubicacion_destino: this.p_ubicacion_destino,
        p_costo: Number(this.p_costo), // Asegúrate de que sea un número
        p_id_vehiculo: this.vehiculo[0].id_vehiculo,
        token: this.token
      };
  
      console.log('Datos a enviar a la API:', datosViaje);
  
      const response = await this.apiService.agregarViaje(datosViaje);
      console.log('Respuesta de la API:', response);
  
      if (response && response.success) {
        await this.mostrarMensaje('Éxito', 'Viaje agregado correctamente');
        this.router.navigate(['/principal']);
      } else {
        throw new Error(response.message || 'La API no devolvió una respuesta exitosa');
      }
    } catch (error: any) {
      console.error('Error al agregar viaje:', error);
      let mensajeError = 'Error al agregar el viaje';
      if (error.error && error.error.message) {
        mensajeError = error.error.message;
      } else if (error.message) {
        mensajeError = error.message;
      }
      await this.mostrarMensaje('Error', mensajeError);
    }
  }

  async cargarUsuario() {
    try {
      const response = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.token
      });

      console.log('Respuesta completa del servidor:', JSON.stringify(response, null, 2));

      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        this.usuario = response.data;
        console.log('Usuario cargado:', JSON.stringify(this.usuario, null, 2));
        
        const userId = this.usuario[0].id_usuario;
        
        if (!userId) {
          console.error('Estructura del usuario:', JSON.stringify(this.usuario[0], null, 2));
          throw new Error('El usuario cargado no tiene un id_usuario válido');
        } else {
          console.log('ID de usuario encontrado:', userId);
        }
      } else {
        throw new Error('No se pudo obtener la información del usuario');
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      throw error;
    }
  }

  async mostrarMensaje(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goBack() {
    this.location.back();
  }
}