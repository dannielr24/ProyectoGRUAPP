import { Injectable } from '@angular/core';

const llave = 'llaveValor';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  // Método para guardar cualquier valor en localStorage
  set(key: string, value: any) {
    console.log(`Guardando en localStorage - Clave: ${key}, Valor: ${value}`);
    localStorage.setItem(key, JSON.stringify(value));
  } 

  // Método para obtener cualquier valor de localStorage
  get(key: string): any {
    try {
      const data = localStorage.getItem(key);
      console.log(`Recuperando de localStorage con clave ${key}:`, data);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error al recuperar clave ${key} de localStorage:`, error);
      return null; // Retorna null si ocurre algún error
    }
  }  

  // Método para eliminar un valor de localStorage
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Método para limpiar datos de sesión
  clearSessionData(): void {
    this.remove('email');
    this.remove('tokenID');
  }

  // Método para guardar el nombre del usuario
  setUserName(uid: string, name: string): void {
    localStorage.setItem(`name_${uid}`, name);
  }

  getUserName(uid: string): string | null {
    const clave = `name_${uid}`;
    const nombre = localStorage.getItem(clave);
    console.log(`Recuperando de localStorage con clave ${clave}: ${nombre}`);
    return nombre;
  }  

  // Otros métodos de usuario como tarjetas, etc.
  setUserCards(tokenID: string, cards: any[]): void {
    if (tokenID) this.set(`cards_${tokenID}`, cards);
  }

  getUserCards(tokenID: string): any[] {
    return tokenID ? this.get(`cards_${tokenID}`) || [] : [];
  }

  setUserSelectedCard(tokenID: string, selectedCard: any): void {
    if (tokenID) this.set(`selectedCard_${tokenID}`, selectedCard);
  }

  getUserSelectCard(tokenID: string): any | null {
    return tokenID ? this.get(`selectedCard_${tokenID}`) : null;
  }

  async obtenerStorage() {
    const data = await this.get(llave);
    if (data == null) {
      return [];
    } else {
      return JSON.parse(data);
    }
  }

  async agregarStorage(data: any) {
    this.set(llave, JSON.stringify(data));
  }

  eliminarStorage() {
    try {
      localStorage.removeItem('usuarioData');
      console.log('Datos eliminados del almacenamiento');
    } catch (error) {
      console.error('Error al eliminar datos del almacenamiento', error);
    }
  }
}
