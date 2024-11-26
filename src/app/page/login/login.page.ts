// login.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from 'src/app/service/storage.service';  // Asegúrate de importar StorageService
import { AuthService } from 'src/app/services/auth.service';  // Importa el servicio AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  constructor(
    private router: Router, 
    private alertcontroller: AlertController, 
    private afAuth: AngularFireAuth,
    private storageService: StorageService, 
    private authService: AuthService  // Inyecta el AuthService
  ) {}

  ngOnInit() {}

  // Método para iniciar sesión
  async login() {
    if (!this.email || !this.password) {
      this.popAlert();
      return;
    }
  
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      const user = userCredential.user;
  
      if (user) {
        const userName = user.displayName || (user.email ? user.email.split('@')[0] : 'Usuario');
        const uid = user.uid;
      
        // Guarda el objeto completo en localStorage
        const userData = { uid, userName, email: this.email };
        localStorage.setItem('user', JSON.stringify(userData));
      
        console.log('Usuario autenticado:', { userName, uid, email: this.email });
      
        // Redirigir al usuario a la página principal
        this.router.navigate(['/principal'], {
          queryParams: { email: this.email }, 
          replaceUrl: true
        });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
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
    this.router.navigate(['/home']);  // Redirige a la página de inicio si hay un error
  }
}
