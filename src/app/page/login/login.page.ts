import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";
  tokenID: string = "";

  constructor(
    private firebase: FirebaseService, 
    private router: Router, 
    private alertcontroller: AlertController, 
    private location: Location, 
    private storage: StorageService
  ) {}

  ngOnInit() {}

  // Método para iniciar sesión
  async login() {
    try {
      // Autenticar al usuario
      let user = await this.firebase.auth(this.email, this.password);
      this.tokenID = await user.user?.getIdToken() || "";

      // Obtener el UID y el nombre del usuario desde Firebase
      const uid = user.user?.uid;
      const name = user.user?.displayName || 'Usuario';  // Obtener nombre real o usar 'Usuario' si no está disponible

      if (this.tokenID && uid) {
        // Almacenar el uid, email y nombre del usuario
        this.storage.set('uid', uid);
        this.storage.set('email', this.email);
        this.storage.setUserName(uid, name);  // Aquí usamos el nombre real del usuario

        // También puedes almacenar los datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({ email: this.email, name }));

      } else {
        console.error('Error: No se pudo obtener el uid o tokenID');
      }

      // Redirigir a la página principal después de login exitoso
      this.router.navigate(['/principal']);
    } catch (error) {
      console.error('Error durante el login:', error);
      this.popAlert();
    }
  }

  // Mostrar un mensaje de alerta en caso de error
  async popAlert() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: "Usuario o contraseña incorrecta",
      buttons: ['Ok']
    });
    await alert.present();
  }

  // Volver a la página anterior
  goBack() {
    this.location.back();
  }
}
