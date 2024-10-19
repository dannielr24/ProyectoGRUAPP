import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Viaje } from '../models/viaje.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialViajesService {
  private viajes: Viaje[] = [];

  constructor() {
    this.viajes = [
      { tipo: 'Auto', fecha: '2024-09-24', origen: 'Punto A', destino: 'Punto B', estado: 'Completado' },
      { tipo: 'Moto', fecha: '2024-09-23', origen: 'Punto C', destino: 'Punto D', estado: 'Cancelado' },
    ];
  }

  getViajes(): Observable<Viaje[]> {
    return of(this.viajes);
  }

  addViaje(viaje: Viaje): void {
    this.viajes.push(viaje);
  }
}
