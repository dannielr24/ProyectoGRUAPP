// login.page.ts
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ApiService } from 'src/app/service/api.service';

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
    private firebase: FirebaseService,
    private apiService: ApiService
  ) {}

  ngOnInit() { }

  async login() {
    try {
      let usuario = await this.firebase.auth(this.email, this.password);
      this.tokenID = await usuario.user?.getIdToken();
  
      // Primero obtener datos del usuario
      const userInfo = await this.apiService.obtenerUsuario({
        p_correo: this.email,
        token: this.tokenID
      });
  
      console.log('Respuesta del servidor:', userInfo);
  
      // Guardar en storage con el ID correcto
      await this.storageService.agregarStorage({
        email: this.email,
        token: this.tokenID,
        idUsuario: userInfo.data[0].id // Asegúrate que sea el campo correcto
      });
  
      this.router.navigate(['/principal']);
    } catch (error) {
      console.error("Error:", error);
      await this.mostrarMensaje('Error', 'Credenciales inválidas');
    }
  }

  private async mostrarMensaje(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async pruebaStorage() {
    const jsonToken: any = {
      token: this.tokenID,
    };
    this.storageService.agregarStorage(jsonToken);
    console.log(await this.storageService.obtenerStorage());
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
