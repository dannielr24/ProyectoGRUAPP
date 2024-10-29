import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { StorageService } from '../service/storage.service';
import { UserModel } from '../models/user.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  usuario: UserModel[] = [];
  imageUrl: string | undefined;
  email: string = '';

  constructor(private apiService: ApiService, private storage: StorageService) {}

  async ngOnInit() {
    await this.cargarUsuario();
  }

  async cargarUsuario() {
    const dataStorage = await this.storage.obtenerStorage();    
    const req = await this.apiService.obtenerUsuario({
      p_correo: this.email,
      token: dataStorage[0].token
    });
    this.usuario = req;
    console.log('DATA INICIO USUARIO ', this.usuario);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    this.imageUrl = image.webPath;
  }
}

