import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Viaje } from '../page/models/viaje.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialViajesService {
  private viajes: Viaje[] = [];
  private viajesSubject: BehaviorSubject<Viaje[]> = new BehaviorSubject<Viaje[]>(this.viajes);

  constructor() {}    


  getViajes(): Observable<Viaje[]> {
    return this.viajesSubject.asObservable();  // Emitir los viajes desde el Subject
  }

  addViaje(viaje: Viaje): void {
    this.viajes.push(viaje);
    this.viajesSubject.next(this.viajes);
  }
}
