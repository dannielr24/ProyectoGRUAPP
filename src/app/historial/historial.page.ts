import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistorialViajesService } from '../services/historial-viajes.service';

interface Viaje {
  tipo: string;
  fecha: string;
  origen: string;
  destino: string;
  estado: string;
}

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
  ) { }

  ngOnInit(): void {
    this.historialService.getViajes().subscribe((viajes) => {
      this.viajes = viajes;
    });
  }

  solicitarGrua() {
    const nuevoViaje: Viaje = { 
      tipo: 'Grúa',
      fecha: new Date().toISOString().split('T')[0],
      origen: 'Punto X',
      destino: 'Punto Y',
      estado: 'Pendiente'
    };

    this.historialService.addViaje(nuevoViaje);

    this.historialService.getViajes().subscribe((viajes) => {
      this.viajes = viajes;
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  goToAccount(page: String) {
    this.router.navigate([`/${page}`])
  }

}
