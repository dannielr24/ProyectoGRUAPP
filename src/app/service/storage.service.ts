import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const llave = 'Llave';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // Claves constantes para el almacenamiento
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_DATA_KEY = 'userData';
  private readonly USER_ID_KEY = 'userId';
  private readonly USERS_KEY = 'users';

  constructor() {}

  async getItem(key: string): Promise<string | null> {
    try {
      const obj = await Preferences.get({ key });
      console.log(`Valor obtenido para la llave ${key}:`, obj.value);
      return obj.value;
    } catch (error) {
      console.error(`Error obteniendo el item con la llave ${key}:`, error);
      return null;
    }
  }  

  public async setItem(key: string, valor: string) {
    await Preferences.set({ key: key, value: valor });
  }

  public async removeItem(key: string) {
    await Preferences.remove({ key: key });
  }

  async obtenerStorage() {
    try {
      const data = await this.getItem(llave);
      console.log('Valor obtenido de storage:', data);  // Verifica el valor recuperado
      if (!data) {
        return null;
      }
      return JSON.parse(data);  // Devuelve los datos en formato JSON para uso posterior
    } catch (error) {
      console.error('Error al obtener datos del storage:', error);
      return null; // Manejo de errores en caso de que no se pueda obtener
    }
  }
  

  async agregarStorage(data: any) {
    try {
      await this.setItem(llave, JSON.stringify(data));
      console.log('Datos guardados en storage:', data);  // Verifica los datos guardados
    } catch (error) {
      console.error('Error al guardar en storage:', error);
      throw error;
    }
  }  

  async limpiarStorage() {
    try {
      await Preferences.clear();
      console.log('Storage limpiado completamente');
    } catch (error) {
      console.error('Error al limpiar storage:', error);
    }
  }

  eliminarStorage(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.USERS_KEY);
      console.log('Storage limpiado completamente');
    } catch (error) {
      console.error('Error al eliminar el storage:', error);
    }
  }

  // Limpiar datos de sesión
  clearSessionData(preserveToken: boolean = false): void {
    console.log('Limpiando datos de sesión. ¿Preservar token?:', preserveToken);
    
    if (!preserveToken) {
      // No elimines el token si el usuario no lo ha solicitado
      localStorage.removeItem(this.TOKEN_KEY);
    }
    
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    console.log('Datos de sesión limpiados');
  }  
}
