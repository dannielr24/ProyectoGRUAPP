import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-listado-vehiculos',
  templateUrl: './listado-vehiculos.page.html',
  styleUrls: ['./listado-vehiculos.page.scss'],
})
export class ListadoVehiculosPage implements OnInit {

  constructor(private apiService: ApiService) { }

  vehiculos: any[]=[];

  ngOnInit() {
    this.obtenerVehiculos();
  }

  async obtenerVehiculos() {
    const p_id = null; 
    const token = 'tu_token_valido'; 
    try {
      this.vehiculos = await this.apiService.obtenerVehiculo(p_id, token);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
    }
  }
  

}
