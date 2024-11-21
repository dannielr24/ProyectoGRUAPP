import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuario: any = null;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  setUsuario(datos: { nombre: string; sexo: string }) {
    this.usuario = datos;
  }

  getUsuario() {
    return this.usuario;
  }

  getAvatar() {
    return this.usuario && this.usuario.sexo === 'M'
      ? 'assets/img/user1.jpg'
      : 'assets/img/user2.jpg';
  }

  getSaludo() {
    return this.usuario ? 'Hola, ${this.usuario.nombre}' : 'Hola';
  }

  registrarUsuario(datosUsuario: any) {
    return this.afAuth.createUserWithEmailAndPassword(datosUsuario.email, datosUsuario.password)
      .then((credenciales) => {
        const uid = credenciales.user?.uid;
        return this.firestore.collection('usuarios').doc(uid).set({
          nombre: datosUsuario.nombre,
          apellido: datosUsuario.apellido,
          rut: datosUsuario.rut,
          fechaNacimiento: datosUsuario.fechaNacimiento,
          email: datosUsuario.fechaNacimiento
        });
      });
  }
}

