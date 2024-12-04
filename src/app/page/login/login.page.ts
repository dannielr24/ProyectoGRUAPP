// login.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from 'src/app/service/storage.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private alertController: AlertController, 
    private afAuth: AngularFireAuth,
    private storageService: StorageService, 
    private authService: AuthService
  ) {}

  ngOnInit() {}

  // Método para iniciar sesión
  async login() {
    if (!this.email || !this.password) {
      await this.showAlert("Error", "Por favor, ingrese correo y contraseña");
      return;
    }
  
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      const user = userCredential.user;
  
      if (user) {
        // Usar el email como base para el userName si no hay displayName
        const userName = user.displayName || 
                         (user.email ? user.email.split('@')[0] : 'Usuario desconocido');
        
        const uid = user.uid;
        const tokenID = await user.getIdToken();
      
        const userData = { 
          uid: uid, 
          userName: userName, 
          email: this.email, 
          token: tokenID 
        };
      
        // Guardar con stringify
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem(`user_${uid}`, JSON.stringify(userData));
      
        console.log('Datos de usuario guardados:', userData);
      
        // Usar métodos de StorageService
        await this.storageService.saveAuthenticatedUser(userData);
        await this.storageService.setToken(tokenID);
      
        this.router.navigate(['/principal'], {
          queryParams: { email: this.email }, 
          replaceUrl: true
        });
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = "Error al iniciar sesión";
      switch(error.code) {
        case 'auth/invalid-email':
          errorMessage = "Correo electrónico inválido";
          break;
        case 'auth/user-disabled':
          errorMessage = "Usuario deshabilitado";
          break;
        case 'auth/user-not-found':
          errorMessage = "Usuario no encontrado";
          break;
        case 'auth/wrong-password':
          errorMessage = "Contraseña incorrecta";
          break;
      }
      
      await this.showAlert("Error", errorMessage);
    }
  }    

  // Método mejorado para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  // Volver a la página anterior
  goBack() {
    this.router.navigate(['/home']);
  }
}