import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { StorageService } from '../service/storage.service';
import { UserModel } from '../models/user.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  usuario: UserModel[] = [];
  imageUrl: string | undefined;
  email: string = '';

  constructor(
    private apiService: ApiService, 
    private storage: StorageService,
    private location: Location
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
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    this.imageUrl = image.webPath;
  }

  goBack() {
    this.location.back();
  }
}

