import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firebase:AngularFireAuth, 
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  async auth(email:string, password:string) {
    const request=await this.firebase.signInWithEmailAndPassword(email,password)
    return request
  }

  async registrar(email: string, password: string, nombre: string, apellido: string, rut: string, fechaNacimiento: string) {
    try {
      const request = await this.firebase.createUserWithEmailAndPassword(email, password);
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
      }

      return request; // Devuelvo el objeto 'request' (userCredential)
    } catch (error) {
      console.error('Error en el registro de usuario:', error);
      throw error; // Lanzamos el error para que el componente pueda manejarlo
    }
  }

  async recuperar(email:string) {
    const request=await this.firebase.sendPasswordResetEmail(email)
    return request
  }


  async logout() {
    return await this.firebase.signOut()
  }

  async isUserLoggedIn(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return !!user;
  }
}
