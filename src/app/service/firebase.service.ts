import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor( 
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private storage: StorageService
  ) {}

  // Método de inicio de sesión en Firebase
  async auth(email: string, password: string) {
    try {
      const request = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = request.user?.uid;

      if (uid) {
        await this.storage.setItem('uid', uid);
        console.log('UID guardado en almacenamiento:', uid);
      }

      return request;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  // Método para registrar un nuevo usuario
  async registrar(email: string, password: string, nombre: string, apellido: string, rut: string, fechaNacimiento: string) {
    try {
      const request = await this.afAuth.createUserWithEmailAndPassword(email, password); // Usar afAuth aquí
      const uid = request.user?.uid;
  
      if (uid) {
        // Almacenar los datos adicionales del usuario en Firestore
        await this.firestore.collection('usuarios').doc(uid).set({
          nombre,
          apellido,
          rut,
          fechaNacimiento,
          email
        });
        console.log('Datos adicionales guardados en Firestore');
  
        // Almacenar el nombre en el servicio de almacenamiento (StorageService)
        await this.storage.setItem('userName', nombre);
  
        // Obtener el usuario actual y actualizar su displayName
        const user = await this.afAuth.currentUser;  // Usar afAuth aquí
        if (user) {
          await user.updateProfile({
            displayName: nombre
          });
        }
      }
  
      return request; // Devuelvo el objeto 'request' (userCredential)
    } catch (error) {
      console.error('Error en el registro de usuario:', error);
      throw error; // Lanzamos el error para que el componente pueda manejarlo
    }
  }

  // Método para recuperar contraseña
  async recuperar(email: string) {
    const request = await this.afAuth.sendPasswordResetEmail(email); // Usar afAuth aquí
    return request;
  }

  // Método para cerrar sesión
  async logout() {
    return await this.afAuth.signOut(); // Usar afAuth aquí
  }

  // Método para comprobar si el usuario está autenticado
  async isUserLoggedIn(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return user != null;
  }

  // Método para actualizar el displayName del usuario
  async updateDisplayName(newDisplayName: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      try {
        await user.updateProfile({
          displayName: newDisplayName,  // Cambia el displayName
          photoURL: user.photoURL,      // Si tienes una foto de perfil
        });

        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Tu nombre ha sido actualizado.',
          buttons: ['OK'],
        });
        await alert.present();
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Hubo un problema al actualizar tu nombre.',
          buttons: ['OK'],
        });
        await alert.present();
        console.error(error);
      }
    }
  }
}
