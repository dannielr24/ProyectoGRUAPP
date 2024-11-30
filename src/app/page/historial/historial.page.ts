import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistorialViajesService } from '../../services/historial-viajes.service';
import { Viaje } from '../models/viaje.model';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  viajes: Viaje[] = [];

  constructor(
    private router: Router,
    private historialService: HistorialViajesService
  ) {}

  ngOnInit() {
    this.historialService.getViajes().subscribe((viajes: Viaje[]) => {
      this.viajes = viajes;
    });
  }

  goBack() {
    this.router.navigate(['/home']);  
  }

  goToAccount(page: String) {
    this.router.navigate([`/${page}`]); 
  }

  verDetalleViaje(viaje: Viaje) {
    this.router.navigate(['/detalle-viaje'], { state: { viaje } });
  }
}
