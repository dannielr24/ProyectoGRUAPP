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
    const req = await this.apiService.obtenerUsuario(
      {
        p_correo: this.email,
        token: dataStorage[0].token
      }
    );
    this.usuario = req;
    console.log("DATA INICIO USUARIO", this.usuario);
    this.cargarViajes();
  }

  async cargarViajes() {
    let dataStorage = await this.storage.obtenerStorage();
    const req = await this.apiService.obtenerVehiculo(
      {
        p_id: this.usuario[0].id_usuario,
        token: dataStorage[0].token
      }
    );
    this.viajes = req.data;
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
