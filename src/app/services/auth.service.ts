//auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../service/storage.service';  // Asegúrate de importar StorageService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData = new BehaviorSubject<any>(null);

  constructor(
    private afAuth: AngularFireAuth, 
    private storageService: StorageService
  ) {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        // Asegúrate de guardar correctamente los datos
        this.storageService.setUserName(user.uid, user.displayName || 'Usuario desconocido');
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          userName: user.displayName || 'Usuario desconocido',
          email: user.email
        }));
        console.log('Usuario autenticado:', user.uid);  // Log para depuración
      }
    });    
  }         

  get currentUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      return new BehaviorSubject(JSON.parse(userData));
    }
    return this.userData.asObservable();
  }    

    async logout() {
      await this.afAuth.signOut();
      this.userData.next(null); // Restablecer el estado del usuario
      // Eliminar el tokenID y el nombre del usuario de localStorage
      localStorage.clear();
      console.log('Sesión cerrada y localStorage limpiado');
    }

    // Método para recuperar el nombre del usuario desde el almacenamiento local
    async getUserNameFromStorage(uid: string): Promise<string | null> {
      // Aquí puedes acceder a una base de datos o almacenamiento adicional si es necesario
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Verificamos si el UID coincide y devolvemos el nombre de usuario
      if (user && user.uid === uid) {
        return user.userName || null;  // Si no tiene userName, se puede devolver null o un valor por defecto
      } else {
        throw new Error('Usuario no encontrado');
      }
    }

    getAuthenticatedUser() {
      return JSON.parse(localStorage.getItem('authenticatedUser') || '{}');
    }    
}
