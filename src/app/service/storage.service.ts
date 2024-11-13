import { Injectable } from '@angular/core';

const llave='llaveValor';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  set(key: string, value: any): void {
    console.log(`Guardando en localStorage con clave ${key}:`, value);
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): any {
    const data = localStorage.getItem(key);
    console.log(`Recuperando de localStorage con clave ${key}:`, data);
    return data ? JSON.parse(data) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clearSessionData(): void {
    this.remove('email');
    this.remove('tokenID');
  }

  setUserName(tokenID: string, name: string): void {
    this.set(`name_${tokenID}`, name);
  }

  getUserName(tokenID: string): string | null {
    return tokenID ? this.get(`name_${tokenID}`) : null;
  }

  // Método para asociar tarjetas
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
      return []
    } else {
      return JSON.parse(data);
    }
  }

  async agregarStorage(data: any) {
    this.set(llave, JSON.stringify(data))
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
