import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { StorageService } from '../service/storage.service';
import { UserModel } from '../models/user.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Location } from '@angular/common';
import { NavController, AlertController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  usuario: UserModel[] = [];
  imageUrl: string | undefined;
  email: string = '';
  userName: string = 'Usuario';

  constructor(
    private apiService: ApiService, 
    private storage: StorageService,
    private location: Location,
    private navCtrl: NavController,
    private appComponent: AppComponent, 
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const dataStorage = await this.storage.obtenerStorage();
    if (dataStorage && dataStorage.length > 0) {
      this.email = dataStorage[0]?.email || ''; // Asigna un valor predeterminado si es necesario
      await this.cargarUsuario();
    } else {
      console.error('No hay datos de almacenamiento disponibles');
    }
  }

  async cargarUsuario() {
    const dataStorage = await this.storage.obtenerStorage();
    if (dataStorage && dataStorage.length > 0) {
        const token = dataStorage[0]?.token;
        this.email = dataStorage[0]?.email || '';
        console.log('Email cargado:', this.email);

        if (token) {
            const req = await this.apiService.obtenerUsuario({
                p_correo: this.email,
                token: token
            });

            console.log('Respuesta de la API:', req);
            if (req && req.length > 0) {
                this.usuario = req;
                console.log('Usuario cargado:', this.usuario);
            } else {
                console.warn('No se encontraron datos para el usuario');
                this.usuario = [];
            }
        } else {
            console.error('Token no disponible en el almacenamiento');
        }
    } else {
        console.error('No hay datos de almacenamiento disponibles');
    }
}

async takePicture() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    this.imageUrl = image.webPath;
    console.log('Imagen capturada con éxito:', this.imageUrl);
  } catch (error: any) {
    const errorMessage = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
    
    if (errorMessage.includes('User cancelled photos app')) {
      console.log('El usuario canceló la operación de la cámara.');
      // Puedes mostrar un mensaje al usuario si lo deseas
    } else {
      console.error('Error al tomar la foto:', errorMessage);
    }
  }
}

  goBack() {
    this.location.back();
  }

  async editProfile() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Ingresa tu nombre',
          value: this.userName,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.name.trim().length > 0) {
              this.userName = data.name;
              this.storage.setUserName(this.email, data.name);
              this.presentAlert('Éxito', 'Perfil actualizado correctamente.');
              return true;
            } else {
              this.presentAlert('Error', 'El nombre no puede estar vacío.');
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  viewSettings() {
    console.log('Ver configuración');
    this.navCtrl.navigateForward('/settings');
  }

  logout() {
    this.appComponent.confirmLogout();
  }
}

