import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuario: any = null;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Guardar el usuario en localStorage
  saveUser(uid: string, email: string, nombre: string, apellido: string): void {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[uid] = { email, nombre, apellido };  // Guarda el usuario con el UID como clave
    localStorage.setItem('users', JSON.stringify(users));  // Guarda todos los usuarios
  }

  // Obtener el usuario por email desde localStorage
  getUserByEmail(email: string) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    // Busca el usuario por el correo electrónico
    for (const uid in users) {
      if (users[uid].email === email) {
        return users[uid];  // Retorna el usuario si lo encuentra
      }
    }
    return null;  // Retorna null si no encuentra al usuario
  }

  // Obtiene los usuarios almacenados en localStorage
  getUsers(): any {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : null;
  }

  // Guarda los datos del usuario
  setUsuario(datos: { nombre: string; sexo: string }) {
    this.usuario = datos;
  }

  // Obtiene el usuario desde Firestore basado en el UID
  getUsuario(uid: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(uid).snapshotChanges().pipe(
      map(snapshot => {
        const data = snapshot.payload.data();
        if (data) {
          return { uid, ...data }; // Retorna los datos junto con el UID
        } else {
          return null; // Si no encuentra al usuario
        }
      })
    );
  }

  // Obtiene el avatar según el sexo del usuario
  getAvatar() {
    return this.usuario && this.usuario.sexo === 'M'
      ? 'assets/img/user1.jpg'
      : 'assets/img/user2.jpg';
  }

  // Genera un saludo personalizado
  getSaludo() {
    return this.usuario ? `Hola, ${this.usuario.nombre}` : 'Hola';
  }

  // Registra un usuario en Firebase Authentication y lo guarda en Firestore
  registrarUsuario(datosUsuario: any) {
    return this.afAuth.createUserWithEmailAndPassword(datosUsuario.email, datosUsuario.password)
      .then((credenciales) => {
        const uid = credenciales.user?.uid;
        return this.firestore.collection('usuarios').doc(uid).set({
          nombre: datosUsuario.nombre,
          apellido: datosUsuario.apellido,
          rut: datosUsuario.rut,
          fechaNacimiento: datosUsuario.fechaNacimiento,
          email: datosUsuario.email
        });
      });
  }
}
