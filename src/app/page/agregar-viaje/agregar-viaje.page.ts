// agregar-viaje.page.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
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
  email = '';
  usuario: UserModel[] = [];
  vehiculo: UserVehiculo[] = [];
  vehiculoSeleccionado: number | null = null;
  p_ubicacion_origen = '';
  p_ubicacion_destino = '';
  p_costo: number | null = null;
  token = '';

  constructor(
    private apiService: ApiService,
    private location: Location,
    private storage: StorageService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    try {
      const dataStorage = await this.storage.obtenerStorage();
      if (!dataStorage || !dataStorage.email || !dataStorage.token) {
        await this.mostrarMensaje('Error', 'Sesión inválida. Inicia sesión nuevamente.');
        this.router.navigate(['/login']);
        return;
      }

      this.email = dataStorage.email;
      this.token = dataStorage.token;
      await this.cargarUsuario();
      if (this.usuario.length) {
        await this.obtenerVehiculos();
      }
    } catch (error) {
      console.error('Error al inicializar la página:', error);
      await this.mostrarMensaje('Error', 'Error al cargar datos.');
      this.router.navigate(['/login']);
    }
  }

  async obtenerVehiculos() {
    try {
      const userId = this.usuario[0]?.id_usuario;
      if (!userId) throw new Error('Usuario no válido.');
      const req = await this.apiService.obtenerVehiculo({ p_id: userId, token: this.token });
      
      if (req?.message !== 'Vehiculo obtenido correctamente!') {
        throw new Error('No se pudo obtener los vehículos.');
      }
      
      this.vehiculo = req?.data || [];
      if (this.vehiculo.length === 0) {
        await this.mostrarMensaje('Aviso', 'No tienes vehículos registrados. Registra un vehículo primero.');
        this.router.navigate(['/agregar-vehiculo']);
        return;
      }
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      this.vehiculo = [];
      await this.mostrarMensaje('Error', 'No se pudo cargar los vehículos.');
    }
  }

  async registrarViaje() {
    if (!this.p_ubicacion_origen || !this.p_ubicacion_destino || !this.p_costo || !this.vehiculoSeleccionado) {
      await this.mostrarMensaje('Error', 'Completa todos los campos y selecciona un vehículo.');
      return;
    }
  
    const userId = this.usuario[0]?.id_usuario;
    if (!userId) {
      await this.mostrarMensaje('Error', 'Información de usuario incompleta.');
      return;
    }
  
    const datosViaje = {
      p_id_usuario: userId,
      p_ubicacion_origen: this.p_ubicacion_origen,
      p_ubicacion_destino: this.p_ubicacion_destino,
      p_costo: this.p_costo,
      p_id_vehiculo: this.vehiculoSeleccionado,
      token: this.token,
    };
  
    try {
      const response = await this.apiService.agregarViaje(datosViaje);
      // Verificar si el mensaje indica éxito
      if (response?.message === 'Viaje agregado correctamente!') {
        await this.mostrarMensaje('Éxito', 'Viaje registrado correctamente.');
        this.router.navigate(['/principal']);
      } else {
        // Si hay un mensaje de error específico en la respuesta
        if (response?.error) {
          await this.mostrarMensaje('Error', response.error);
        } else {
          throw new Error('Error al registrar el viaje.');
        }
      }
    } catch (error: any) {
      console.error('Error al registrar viaje:', error);
      const mensajeError = error?.message || 'No se pudo registrar el viaje.';
      await this.mostrarMensaje('Error', mensajeError);
    }
  }

  async cargarUsuario() {
    try {
      const response = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.token,
      });
      this.usuario = response?.data || [];
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