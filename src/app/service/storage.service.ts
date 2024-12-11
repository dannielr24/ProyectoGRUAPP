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

  public async obtenerStorage() {
    const data = await this.getItem(llave);
    if (data == null) {
      return [];
    } else {
      return JSON.parse(data);
    }
  }

  public async agregarStorage(data: any) {
    await this.setItem(llave, JSON.stringify(data));
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
      localStorage.removeItem(this.TOKEN_KEY);
    }
    
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    console.log('Datos de sesión limpiados');
  }
}
