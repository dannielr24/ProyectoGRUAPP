import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { StorageService } from 'src/app/service/storage.service'; // Asegúrate de que el nombre esté bien escrito
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-agregar-vehiculo',
  templateUrl: './agregar-vehiculo.page.html',
  styleUrls: ['./agregar-vehiculo.page.scss'],
})
export class AgregarVehiculoPage implements OnInit {
  patente: string = '';
  marca: string = '';
  modelo: string = '';
  anio: number = new Date().getFullYear();
  color: string = '';
  tipoCombustible: string = '';
  archivoImagen: File | null = null;
  previewImage: string | undefined;
  token: string = '';
  idUsuario: number = 0;
  email: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService,
    private storage: StorageService
  ) {}

  async ngOnInit() {
    try {
      const userData = await this.storage.obtenerStorage();
      console.log('Datos del storage:', userData);

      if (!userData) {
        await this.mostrarMensaje('Error', 'No hay sesión activa');
        this.router.navigate(['/login']);
        return;
      }

      // Si userData es un array, tomar el primer elemento
      const userInfo = Array.isArray(userData) ? userData[0] : userData;
      
      this.token = userInfo.token;
      this.email = userInfo.email;

      // Obtener datos actualizados del usuario
      try {
        const response = await this.apiService.obtenerUsuario({
          p_correo: this.email,
          token: this.token
        });

        if (response && response.data && response.data[0]) {
          this.idUsuario = response.data[0].id_usuario;
          console.log('ID Usuario obtenido:', this.idUsuario);
        } else {
          throw new Error('No se pudo obtener el ID del usuario');
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        await this.mostrarMensaje('Error', 'No se pudo obtener la información del usuario');
        this.router.navigate(['/login']);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      await this.mostrarMensaje('Error', 'Error al cargar datos de sesión');
      this.router.navigate(['/login']);
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.previewImage = image.dataUrl;
      
      const response = await fetch(image.dataUrl!);
      const blob = await response.blob();
      this.archivoImagen = new File([blob], 'vehiculo.jpg', { type: 'image/jpeg' });
      
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      await this.mostrarMensaje('Error', 'No se pudo tomar la foto');
    }
  }

  async pickFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      this.previewImage = image.dataUrl;
      
      const response = await fetch(image.dataUrl!);
      const blob = await response.blob();
      this.archivoImagen = new File([blob], 'vehiculo.jpg', { type: 'image/jpeg' });

    } catch (error) {
      console.error('Error al seleccionar imagen de la galería:', error);
      await this.mostrarMensaje('Error', 'No se pudo seleccionar la imagen');
    }
  }

  // Mostrar alerta con el mensaje proporcionado
  async mostrarMensaje(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para registrar el vehículo
  async agregarVehiculo() {
    try {
      if (!this.patente || !this.marca || !this.modelo || !this.anio || !this.color || !this.tipoCombustible) {
        await this.mostrarMensaje('Error', 'Por favor complete todos los campos');
        return;
      }

      if (!this.archivoImagen) {
        await this.mostrarMensaje('Error', 'Por favor seleccione una imagen del vehículo');
        return;
      }

      const vehiculoData = {
        p_id_usuario: this.idUsuario,
        p_patente: this.patente.toUpperCase(),
        p_marca: this.marca,
        p_modelo: this.modelo,
        p_anio: this.anio,
        p_color: this.color,
        p_tipo_combustible: this.tipoCombustible,
        token: this.token
      };

      console.log('Datos a enviar:', vehiculoData);

      const response = await this.apiService.agregarVehiculo(vehiculoData, this.archivoImagen);
      console.log('Respuesta del servidor:', response);

      await this.mostrarMensaje('Éxito', 'Vehículo agregado correctamente');
      this.router.navigate(['/principal']);
      
    } catch (error: any) {
      console.error('Error al agregar vehículo:', error);
      let mensajeError = 'Error al agregar el vehículo';
      if (error.error && error.error.message) {
        mensajeError = error.error.message;
      } else if (error.message) {
        mensajeError = error.message;
      }
      await this.mostrarMensaje('Error', mensajeError);
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
      console.log('Archivo seleccionado:', this.archivoImagen?.name);
    }
  }
  
  goBack() {
    this.router.navigate([ '/principal' ]); // O la ruta a la que quieras regresar
    }
  }
