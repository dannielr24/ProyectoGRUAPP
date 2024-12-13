import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Location } from '@angular/common';
import { UserModel } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';  // Importamos Router
import { StorageService } from 'src/app/service/storage.service';
import { AlertController, AnimationController } from '@ionic/angular';
import { UserVehiculo } from '../models/user-vehiculo.model';

@Component({
  selector: 'app-listado-vehiculos',
  templateUrl: './listado-vehiculos.page.html',
  styleUrls: ['./listado-vehiculos.page.scss'],
})
export class ListadoVehiculosPage implements OnInit {

  email: string = "";
  usuario: UserModel[] = [];
  vehiculo: UserVehiculo[] = [];
  vehiculos: any[] = [];
  token = '';

  constructor(
    private apiService: ApiService,
    private location: Location,
    private activate: ActivatedRoute,
    private storage: StorageService,
    private animationCtrl: AnimationController,
    private alertController: AlertController,
    private router: Router  // Inyectamos el Router para redirigir
  ) {
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log('Email obtenido de los parámetros:', this.email);
    });
  }

  async ngOnInit() {
    try {
      const dataStorage = await this.storage.obtenerStorage();
      if (!dataStorage || !dataStorage.email || !dataStorage.token) {
        await this.mostrarMensaje('Error', 'Sesión inválida. Inicia sesión nuevamente.');
        this.router.navigate(['/login']);
        return;
      }
  
      // Asegúrate de actualizar los datos del usuario
      this.email = dataStorage.email;
      this.token = dataStorage.token;
  
      // Limpiar los datos anteriores antes de cargar nuevos
      this.usuario = [];
      this.vehiculos = [];
  
      // Cargar el nuevo usuario
      await this.cargarUsuario();
      if (this.usuario.length) {
        // Obtener los vehículos del nuevo usuario
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
      
      // Asignar los vehículos del usuario actual
      this.vehiculos = req?.data || [];
      
      if (this.vehiculos.length === 0) {
        await this.mostrarMensaje('Aviso', 'No tienes vehículos registrados. Registra un vehículo primero.');
        this.router.navigate(['/agregar-vehiculo']);
        return;
      }
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      this.vehiculos = []; // Asegúrate de limpiar los vehículos si ocurre un error
      await this.mostrarMensaje('Error', 'No se pudo cargar los vehículos.');
    }
  }    

  async cargarUsuario() {
    try {
      const response = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.token,
      });
      this.usuario = response?.data || [];
      if (this.usuario.length > 0) {
        console.log('Usuario cargado:', this.usuario);
      } else {
        throw new Error('No se encontró el usuario.');
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
