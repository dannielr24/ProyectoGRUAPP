import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  fechaNacimiento: string = '';
  email: string;
  password: string;

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
    this.email = '';
    this.password = '';
  }

  async register() {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      console.log('User registered successfully:', userCredential);

      // Obtener el UID del usuario creado
      const uid = userCredential.user?.uid;

      // Almacenar los datos adicionales en Firestore
      if (uid) {
        await this.firestore.collection('usuarios').doc(uid).set({
          nombre: this.nombre,
          apellido: this.apellido,
          rut: this.rut,
          fechaNacimiento: this.fechaNacimiento,
          email: this.email
        });
        console.log('Datos adicionales guardados en Firestore');
      }

      // Redirige a otra página o muestra un mensaje
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error registering user:', error);
      // Maneja el error de registro
    }
  }
}


