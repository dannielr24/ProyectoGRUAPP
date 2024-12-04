import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';  // Importa el servicio ApiService
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Formulario reactivo para validaciones
import { Location } from '@angular/common';
import { StorageService } from 'src/app/service/storage.service';
import { Token } from '@angular/compiler';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserVehiculo } from '../models/user-vehiculo.model';

@Component({
  selector: 'app-agregar-viaje',
  templateUrl: './agregar-viaje.page.html',
  styleUrls: ['./agregar-viaje.page.scss'],
})
export class AgregarViajePage implements OnInit {

  email: string= "";
  usuario: UserModel[]=[];
  vehiculo: UserVehiculo[]=[];
  vehiculos: any[]=[];
  p_ubicacion_origen: string = '';
  p_ubicacion_destino: string = '';
  p_costo: number = 0;


  constructor(
    private apiService: ApiService,  // Inyección del servicio
    private formBuilder: FormBuilder, // Inyección de FormBuilder para el manejo del formulario reactivo
    private location: Location,
    private storage: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.obtenerVehiculos();
  }

  async obtenerVehiculos() {
    let dataStorage = await this.storage.obtenerStorage();
    const req = await this.apiService.obtenerVehiculo(
      {
        p_id: this.usuario[0].id_usuario,
        token: dataStorage[0].token
      }
    );
    this.vehiculo = req.data;
    await this.obtenerVehiculos();
  }

  async registrarViaje() {
    let dataStorage = await this.storage.obtenerStorage();
    try {
      const request = await this.apiService.agregarViaje(
        {
          p_id_usuario: this.usuario[0].id_usuario,
          p_ubicacion_origen: this.p_ubicacion_origen,
          p_ubicacion_destino: this.p_ubicacion_destino,
          p_costo: this.p_costo,
          p_id_vehiculo: this.vehiculo[0].id_vehiculo,
          token: dataStorage[0].token
        }
      );
      this.router.navigateByUrl('principal');
    } catch (error) {
      console.log(error);
    }
  }

  // Método para retroceder a la página anterior
  goBack() {
    this.location.back();
  }
}
