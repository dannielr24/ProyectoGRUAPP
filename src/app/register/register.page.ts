import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string;
  password: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.email = '';
    this.password = '';
  }

  async register() {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      console.log('User registered successfully:', userCredential);
      // Redirige a otra página o muestra un mensaje
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error registering user:', error);
      // Maneja el error de registro
      // Por ejemplo, puedes mostrar un mensaje de error en la interfaz de usuario
    }
  }
}


