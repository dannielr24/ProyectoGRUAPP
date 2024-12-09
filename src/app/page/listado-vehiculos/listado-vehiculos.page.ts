import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Location } from '@angular/common';
import { UserModel } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';
import { AlertController, AnimationController } from '@ionic/angular';
import { UserVehiculo } from '../models/user-vehiculo.model';

@Component({
  selector: 'app-listado-vehiculos',
  templateUrl: './listado-vehiculos.page.html',
  styleUrls: ['./listado-vehiculos.page.scss'],
})
export class ListadoVehiculosPage implements OnInit {

  email: string= "";
  usuario: UserModel[]=[];
  vehiculo: UserVehiculo[]=[];
  vehiculos: any[]=[];

  constructor(
    private apiService: ApiService,
    private location: Location,
    private activate: ActivatedRoute,
    private storage: StorageService,
    private animationCtrl: AnimationController,
    private alertController: AlertController
  ) { 
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log(this.email)
    })
  }

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
    this.obtenerVehiculos();
  }

  async obtenerVehiculos() {
    let dataStorage = await this.storage.obtenerStorage();
    const req = await this.apiService.obtenerVehiculo(
      {
        p_id: this.usuario[0].id_usuario,
        token: dataStorage[0].token
      }
    );
    this.vehiculos = req.data;
    console.log("DATA INICIO VEHÍCULO", this.vehiculos);
  }

  goBack() {
    this.location.back();
  }
}

