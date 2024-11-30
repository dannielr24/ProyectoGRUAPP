//storage.service.ts
import { Injectable } from '@angular/core';

const llave = 'llaveValor';
const TOKEN_KEY = 'tokenID';
const USERS_KEY = 'users';
const CARDS_KEY = 'cards';
const UID_KEY = 'userID';


interface Usuario {
  id_usuario: number;
  email: string;
  // Agrega las demás propiedades del usuario si es necesario
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  // Método para guardar cualquier valor en localStorage
  set(key: string, value: any): void {
    console.log(`Guardando en localStorage - Clave: ${key}, Valor: ${value}`);
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Método para obtener cualquier valor de localStorage
  get(key: string): any {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        console.warn(`No se encontró el valor para la clave ${key}`);
        return null;  // Devuelve null si no hay datos
      }
      return JSON.parse(data);  // Retorna los datos parseados
    } catch (error) {
      console.error(`Error al recuperar clave ${key} de localStorage:`, error);
      return null;  // Si hay un error, devuelve null
    }
  } 
  
  // Método para eliminar el token
  removeToken() {
    this.remove('tokenID');
  }

  // Método para eliminar cualquier clave
  remove(key: string): void {
    console.log(`Eliminando clave de localStorage: ${key}`);
    localStorage.removeItem(key);
  }

  // Método para limpiar datos de sesión
  clearSessionData(preserveToken: boolean = false): void {
    console.log('clearSessionData llamado. ¿Preservar token?', preserveToken);
    console.log('Limpiando datos de sesión...');
    if (!preserveToken) {
      this.remove('tokenID');
    }
    this.remove('user');
  }    

  // Método para guardar el nombre del usuario
  setUserName(uid: string, userName: string) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[uid] = userName; // Actualiza o agrega el usuario
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Usuarios almacenados:', users); // Agrega un log para validar
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
    try {
      const data = await this.get(llave);
      console.log(`Recuperando de localStorage con clave ${llave}:`, data);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al recuperar datos de localStorage:', error);
      return null;
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

  // Método para guardar el token
  setToken(token: string) {
    this.set('tokenID', token);
  }

  // Método para obtener el token
  getToken(): string | null {
    return this.get(TOKEN_KEY);
  }
  
  // Método para obtener los usuarios almacenados
  getUsers(): any {
    return this.get(USERS_KEY);
  }

  async saveUser(uid: string, userName: string) {
    const users = await this.get('users') || {};
    users[uid] = userName;
    await this.set('users', users);
  }  
  
  getUserByEmail(email: string): Usuario | null {
    const users: { [key: string]: Usuario } = JSON.parse(localStorage.getItem('users') || '{}');
    const user = Object.values(users).find((user) => user.email === email);
    if (!user) {
      console.warn('Usuario no encontrado para email:', email);
    }
    return user || null;
  }    
  
  setAuthenticatedUser(user: any) {
    localStorage.setItem('authenticatedUser', JSON.stringify(user));
  }
  
  // Método para guardar el ID del usuario en localStorage
  setUserID(uid: string): void {
    console.log(`Guardando ID del usuario: ${uid}`);
    localStorage.setItem(UID_KEY, uid);
  }

  // Método para obtener el ID del usuario desde localStorage
  getUserID(): string | null {
    const uid = localStorage.getItem(UID_KEY);
    console.log(`Recuperando ID del usuario: ${uid}`);
    return uid;
  }

  // Método para eliminar el ID del usuario de localStorage
  removeUserID(): void {
    console.log('Eliminando ID del usuario de localStorage');
    localStorage.removeItem(UID_KEY);
  }
}
