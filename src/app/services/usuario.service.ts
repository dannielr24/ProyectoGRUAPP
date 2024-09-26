import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuario: any = null;

  constructor() {}

  setUsuario(datos: { nombre: string; sexo: string }) {
    this.usuario = datos;
  }

  getUsuario() {
    return this.usuario;
  }

  getAvatar() {
    return this.usuario && this.usuario.sexo === 'M'
      ? 'assets/img/user1.jpg'
      : 'assets/img/user2.jpg';
  }

  getSaludo() {
    return this.usuario ? 'Hola, ${this.usuario.nombre}' : 'Hola';
  }
}

