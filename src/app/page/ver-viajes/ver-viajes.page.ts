import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserModel } from '../models/user.model';
import { StorageService } from 'src/app/service/storage.service';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-ver-viajes',
  templateUrl: './ver-viajes.page.html',
  styleUrls: ['./ver-viajes.page.scss'],
})
export class VerViajesPage implements OnInit {

  email: string= "";
  usuario: UserModel[]=[];
  viajes: any[] = [];

  constructor(
    private location: Location,
    private storage: StorageService,
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController,
    private animationCtrl: AnimationController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.cargarUsuario();
    });
  }

  async cargarUsuario() {
    let dataStorage = await this.storage.obtenerStorage();
    console.log("DataStorage:", dataStorage);
  
    if (!dataStorage || !dataStorage.token) {
      console.error("El almacenamiento no contiene datos válidos.");
      this.popAlertNoViajes();
      return;
    }
  
    try {
      const req = await this.apiService.obtenerUsuario({
        p_correo: dataStorage.email,
        token: dataStorage.token,
      });
      console.log("Usuario recibido:", req);
  
      // Asegúrate de acceder a `req.data` si la estructura es como se muestra en la consola
      if (req && req.data && req.data.length > 0) {
        this.usuario = req.data; // Asignamos el array de usuarios
      } else {
        console.error("La respuesta del usuario no contiene datos válidos");
        this.popAlertNoViajes();
        return;
      }
  
      // Verifica que haya un `id_usuario` válido en el primer elemento
      if (this.usuario[0]?.id_usuario) {
        this.cargarViajes();
      } else {
        console.error("El usuario no contiene id_usuario");
        this.popAlertNoViajes();
      }
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
      this.popAlertNoViajes();
    }
  }    

  async cargarViajes() {
    console.log("Iniciando cargarViajes");
    console.log("Usuario actual:", this.usuario);
  
    if (!this.usuario || this.usuario.length === 0 || !this.usuario[0].id_usuario) {
      console.error("No hay usuario disponible o no tiene id_usuario para cargar los viajes.");
      this.viajes = [];
      await this.popAlertNoViajes();
      return;
    }
  
    let dataStorage = await this.storage.obtenerStorage();
    console.log("DataStorage en cargarViajes:", dataStorage);
  
    if (!dataStorage || !dataStorage.token) {
      console.error("El almacenamiento no contiene datos válidos.");
      this.viajes = [];
      await this.popAlertNoViajes();
      return;
    }
  
    try {
      console.log("Llamando a la API con id_usuario:", this.usuario[0].id_usuario);
      const req = await this.apiService.obtenerViaje({
        p_id_usuario: this.usuario[0].id_usuario,
        token: dataStorage.token,
      });
      console.log("Respuesta completa de la API:", req);
  
      // Verificar la estructura específica de la respuesta de tu API
      if (req && req.data && Array.isArray(req.data)) {
        this.viajes = req.data;
      } else {
        console.warn("La respuesta de viajes está vacía o no es válida.");
        this.viajes = [];
      }
  
      console.log("Viajes asignados:", this.viajes);
  
      if (this.viajes.length === 0) {
        await this.popAlertNoViajes();
      }
    } catch (error) {
      console.error("Error al cargar los viajes:", error);
      this.viajes = [];
      await this.popAlertNoViajes();
    }
  }       

  async popAlertNoViajes() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: "Sin viajes registrados",
      buttons: ['ok']
    });
    await alert.present();
  }

  goBack() {
    this.location.back();
  }

}
