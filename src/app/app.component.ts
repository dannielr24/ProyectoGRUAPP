import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './service/firebase.service';
import { AlertController, LoadingController, Platform, MenuController } from '@ionic/angular';
import { StorageService } from './service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userEmail: string = '';
  userName: string = 'Usuario';
  userPhoto: string = 'assets/images/default-user.png';

  constructor(
    private router: Router,
    private firebase: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
    private menuController: MenuController,
    private storage: StorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {});
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const storedEmail = await this.storage.get('email');
    if (storedEmail) {
      this.userEmail = storedEmail;
  
      const storedName = await this.storage.getUserName(this.userEmail);
      if (storedName) {
        this.userName = storedName;
      }
    }
  
    const storedPhoto = await this.storage.get('photo');
    if (storedPhoto) {
      this.userPhoto = storedPhoto;
    }
  }  

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Cerrar Sesión', handler: () => this.logout() }
      ]
    });

    await alert.present();
  }

  async logout() {
    await this.menuController.close();

    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 1000,
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.firebase.logout();
      this.storage.clearSessionData(true);
      await loading.onDidDismiss();
      this.router.navigate(['/login']);
    } catch (error) {
      await loading.dismiss();
      console.error('Error al cerrar sesión:', error);
      this.presentAlert('Error', 'No se pudo cerrar sesión. Inténtalo de nuevo.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async editProfile() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Ingresa tu nombre', value: this.userName }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.name.trim().length > 0) {
              this.userName = data.name;
              this.storage.setUserName(this.userEmail, data.name);
              this.presentAlert('Éxito', 'Perfil actualizado correctamente.');
              return true;
            } else {
              this.presentAlert('Error', 'El nombre no puede estar vacío.');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async takePicture() {
    // Implementación de tomar foto (requiere plugins/capacidades de la cámara)
    this.presentAlert('Función en desarrollo', 'La función de tomar una foto estará disponible próximamente.');
  }

  verificarUsuario() {
    const usuarioString = localStorage.getItem('usuario');
    
    if (!usuarioString) {
      console.log("No se encontró usuario en localStorage");
      this.router.navigate(['/login']); // Redirige al login si no hay usuario
    } else {
      const usuario = JSON.parse(usuarioString);
      console.log("Usuario recuperado: ", usuario);
      // Aquí puedes redirigir al usuario a la página principal o dashboard
      this.router.navigate(['/home']);
    }
  }
  
}
