// login.page.ts
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";
  tokenID: any = "";
  usuario: any = null;

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private storageService: StorageService, 
    private firebase: FirebaseService
  ) {}

  ngOnInit() {}

  async onSubmit(email: string, password: string): Promise<void> {
    try {
      const response = await this.storageService.signIn(email, password);
      console.log('Login successful', response);
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  // Método para iniciar sesión
  async login() {
    try {
      let usuario = await this.firebase.auth(this.email, this.password);
      
      if (!usuario.user) {
        throw new Error('No se pudo autenticar el usuario');
      }
  
      // Obtener el token y verificar que exista
      const token = await usuario.user.getIdToken();
      if (!token) {
        throw new Error('No se pudo obtener el token');
      }
  
      // Guardar el token
      await this.storageService.setToken(token);
  
      // Guardar los datos del usuario
      const userData = {
        email: usuario.user.email || '',
        uid: usuario.user.uid,
        displayName: usuario.user.displayName || 'Usuario desconocido'
      };
  
      // Guardar datos del usuario
      this.storageService.saveUserData(userData);
  
      const navigationExtras: NavigationExtras = {
        queryParams: { email: this.email }
      };
      
      // Ya no necesitamos pruebaStorage() ya que estamos manejando el token correctamente
      this.router.navigate(['/principal'], navigationExtras);
    } catch (error) {
      console.error('Error en login:', error);
      this.popAlert();
    }
  }  

  // Método mejorado para mostrar alertas
  async popAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: "Usuario o contraseña incorrecto",
      buttons: ['Ok']
    });
    await alert.present();
  }

  async pruebaStorage() {
    const jsonToken: any = {
      token: this.tokenID
    }
    this.storageService.agregarStorage(jsonToken);
    console.log(await this.storageService.obtenerStorage());
  }

  // Volver a la página anterior
  goBack() {
    this.router.navigate(['/home']);
  }
}
