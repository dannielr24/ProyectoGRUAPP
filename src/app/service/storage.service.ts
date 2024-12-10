//storage.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Preferences } from '@capacitor/preferences';

const llave = 'llaveValor';
const TOKEN_KEY = 'token';
const CARDS_KEY = 'cards';
const UID_KEY = 'userID';
const key = 'keyValor';
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userID',
  USER_DATA: 'usuarioData',
};


interface Usuario {
  id_usuario: number;
  email: string;
  // Agrega las demás propiedades del usuario si es necesario
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private afAuth: AngularFireAuth) {}

  // Guardar un valor en el almacenamiento local
  async setItem(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener un valor del almacenamiento local
  getItem(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async saveItem(key: string, valor: string) {
    await this.setItem(key, valor);  
  }

   // Eliminar un valor del almacenamiento local
   removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Función para iniciar sesión y guardar el token
  async signIn(email: string, password: string): Promise<any> {
    try {
      const request = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (request.user) {
        const token = await request.user.getIdToken();
        this.setToken(token); // Guardar el token como cadena
        console.log('Token guardado correctamente:', token);
      }
      return request;
    } catch (error) {
      console.error('Error durante la autenticación de Firebase:', error);
      throw error;
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
    this.removeItem(TOKEN_KEY);
  }

  // Método para eliminar cualquier clave
  remove(key: string): void {
    console.log(`Eliminando clave de localStorage: ${key}`);
    localStorage.removeItem(key);
  }

  // Método para guardar el nombre del usuario
  setUserName(uid: string, userName: string) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[uid] = userName; // Almacenar solo el nombre del usuario, no el objeto completo
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Usuarios almacenados:', users);
  }    

  getUserName(uid: string): string | null {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[uid] || null;  // Recuperar el nombre de usuario según el UID
  }  

  async obtenerStorage() {
    const data = await this.getItem(key);
    if (data == null){
      return []
    } else {
      return JSON.parse(data);
    }
  }

  async agregarStorage(data: any) {
    console.log('Guardando datos en el localStorage:', data);
    this.setItem(llave, JSON.stringify(data));
}

  eliminarStorage() {
    try {
      localStorage.removeItem('usuarioData');
      console.log('Datos eliminados del almacenamiento');
    } catch (error) {
      console.error('Error al eliminar datos del almacenamiento', error);
    }
  }

   // Guardar el token de autenticación
   async saveToken(token: string) {
    await Preferences.set({ key: 'token', value: token });
  }

  // Guardar el token
  setToken(token: string): void {
    if (!token) {
      console.error('Intento de guardar token nulo o indefinido');
      return;
    }
    localStorage.setItem('authToken', token);
    console.log('Token guardado exitosamente');
  }
  
  async getToken(): Promise<string | null> {
    return localStorage.getItem('authToken');
  }
 
  // Guardar el ID del usuario
  async saveUserId(uid: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_ID, uid);
  }

  // Obtener el ID del usuario
  getUserId(): string | null {
    return this.getItem(STORAGE_KEYS.USER_ID);
  }

  // Guardar datos completos del usuario
  async saveUserData(data: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DATA, data);
  }

  // Obtener datos completos del usuario
  getUserData(): any {
    return this.getItem(STORAGE_KEYS.USER_DATA);
  }
}
