import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './service/firebase.service';
import { AlertController, LoadingController, Platform, MenuController } from '@ionic/angular';
import { StorageService } from './service/storage.service';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  userEmail: string = '';
  userName: string = 'Usuario';
  userPhoto: string = 'assets/images/user1.jpg';


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
    this.platform.ready().then(() => {

    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const storedEmail = this.storage.get('email');
    if (storedEmail) {
      this.userEmail = storedEmail;
      const storedName = this.storage.getUserName(this.userEmail);
      if (storedName) {
        this.userName = storedName;
      }
    }

    const storedPhoto = this.storage.get('photo');
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
      this.storage.clearSessionData();
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

}
