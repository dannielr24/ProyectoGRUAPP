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
  viajes: any[]=[];

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
    this.cargarUsuario();
  }

  async cargarUsuario() {
    let dataStorage = await this.storage.obtenerStorage();
    console.log("DataStorage:", dataStorage);
  
    if (!dataStorage || dataStorage.length === 0 || !dataStorage[0]?.token) {
      console.error("El almacenamiento no contiene datos válidos.");
      this.popAlertNoViajes();
      return;
    }
  
    try {
      const req = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: dataStorage[0].token,
      });
      console.log("Usuario recibido:", req);
      this.usuario = req;
      this.cargarViajes();
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
    }
  }  

  async cargarViajes() {
    if (!this.usuario || this.usuario.length === 0) {
      console.error("No hay usuario disponible para cargar los viajes.");
      this.viajes = [];
      this.popAlertNoViajes();
      return;
    }
  
    let dataStorage = await this.storage.obtenerStorage();
    console.log("DataStorage en cargarViajes:", dataStorage);
  
    if (!dataStorage || dataStorage.length === 0 || !dataStorage[0]?.token) {
      console.error("El almacenamiento no contiene datos válidos.");
      this.viajes = [];
      this.popAlertNoViajes();
      return;
    }
  
    try {
      const req = await this.apiService.obtenerVehiculo({
        p_id: this.usuario[0].id_usuario,
        token: dataStorage[0].token,
      });
      console.log("Viajes recibidos:", req);
      this.viajes = req.data || [];
    } catch (error) {
      console.error("Error al cargar los viajes:", error);
      this.viajes = [];
      this.popAlertNoViajes();
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
