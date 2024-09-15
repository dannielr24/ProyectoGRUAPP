import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {}

  onSubmit() {
    // Aquí puedes agregar la lógica para el inicio de sesión
    console.log('Correo electrónico:', this.email);
    console.log('Contraseña:', this.password);

    // Redirige a otra página si el inicio de sesión es exitoso
    this.navCtrl.navigateForward('/home');
  }
}