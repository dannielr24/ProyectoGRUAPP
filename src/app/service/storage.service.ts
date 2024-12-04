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
  async set(key: string, value: any): Promise<void> {
    try {
      console.log(`Guardando en localStorage - Clave: ${key}`);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  }

  // Método para obtener cualquier valor de localStorage
  get(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error al recuperar clave ${key} de localStorage:`, error);
      return null;
    }
  }

  // Método mejorado para guardar usuario autenticado
  async saveAuthenticatedUser(userData: any) {
    try {
      // Guardar el objeto completo, no solo un string
      localStorage.setItem(`user_${userData.uid}`, JSON.stringify(userData));
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      console.log('Usuario guardado correctamente:', userData);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  }  

  // Método para obtener usuario autenticado actual
  async getCurrentUser(): Promise<any | null> {
    try {
      const currentUserId = this.get('currentUser');
      if (!currentUserId) {
        console.warn('No hay usuario autenticado');
        return null;
      }

      const user = this.get(`user_${currentUserId}`);
      return user || null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
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
  
  // Método para eliminar el token
  removeToken() {
    this.remove('tokenID');
  }

  // Método para eliminar cualquier clave
  remove(key: string): void {
    console.log(`Eliminando clave de localStorage: ${key}`);
    localStorage.removeItem(key);
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
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        return JSON.parse(currentUser);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
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
  
  // Guardar los datos del usuario autenticado
  setAuthenticatedUser(user: any) {
    localStorage.setItem('authenticatedUser', JSON.stringify(user));
  }

  // Recuperar los datos del usuario autenticado
  getAuthenticatedUser() {
    const user = localStorage.getItem('authenticatedUser');
    console.log('Usuario desde Storage:', user);
    return user ? JSON.parse(user) : null;
  }
  

  // Eliminar los datos del usuario autenticado
  clearAuthenticatedUser() {
    localStorage.removeItem('authenticatedUser');
  }
  
  // Método para guardar un usuario
  async setUser(user: any): Promise<void> {
    const users = JSON.parse(await this.get(USERS_KEY) || '{}');
    users[user.uid] = user; 
    await this.set(USERS_KEY, users); 
  }
  
  // Método para obtener un usuario por su uid
  async getUserByUid(uid: string): Promise<any | null> {
    const users = JSON.parse(await this.get(USERS_KEY) || '{}');
    return users[uid] || null; 
  }

  // Método para eliminar un usuario por su uid
  async removeUserByUid(uid: string): Promise<void> {
    const users = JSON.parse(await this.get(USERS_KEY) || '{}');
    delete users[uid]; 
    await this.set(USERS_KEY, users); 
  }
}

interface Card {
  id: string;
  name: string;
  // Otros campos que pueda tener la tarjeta
}