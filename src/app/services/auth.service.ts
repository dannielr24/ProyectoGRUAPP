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
        this.userData.next(user);
        // Almacenar el nombre y email en localStorage
        this.storageService.setUserName(user.uid, user.displayName || 'Usuario desconocido');
        localStorage.setItem('user', JSON.stringify({ uid: user.uid, userName: user.displayName, email: user.email }));
      } else {
        this.userData.next(null);
        localStorage.removeItem('user');
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
    getUserNameFromStorage(uid: string) {
        return this.storageService.getUserName(uid);  // Usamos el servicio de almacenamiento para obtener el nombre
    }
}
