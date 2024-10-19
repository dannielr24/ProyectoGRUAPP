import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  log(message: string): void {
    // Aquí podrías enviar el mensaje a un servidor o guardarlo en el almacenamiento local
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    // Método para registrar errores
    console.error(`[ERROR] ${message}`);
  }

  warn(message: string): void {
    // Método para registrar advertencias
    console.warn(`[WARNING] ${message}`);
  }
}
