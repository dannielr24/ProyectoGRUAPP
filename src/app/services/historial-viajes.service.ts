import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Viaje } from '../models/viaje.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialViajesService {
  private viajes: Viaje[] = [];
  private viajesSubject: BehaviorSubject<Viaje[]> = new BehaviorSubject<Viaje[]>(this.viajes);

  constructor() {
    this.viajes = [
      { tipo: 'Auto', fecha: '2024-09-24', origen: 'Punto A', destino: 'Punto B', estado: 'Completado' },
      { tipo: 'Moto', fecha: '2024-09-23', origen: 'Punto C', destino: 'Punto D', estado: 'Cancelado' },
    ];
  }

  getViajes(): Observable<Viaje[]> {
    return this.viajesSubject.asObservable();
  }

  addViaje(viaje: Viaje): void {
    this.viajes.push(viaje);
    this.viajesSubject.next(this.viajes);
  }
}
