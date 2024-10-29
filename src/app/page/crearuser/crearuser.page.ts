import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/service/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crearuser',
  templateUrl: './crearuser.page.html',
  styleUrls: ['./crearuser.page.scss'],
})
export class CrearuserPage implements OnInit {

  constructor(
    private firebase: FirebaseService, 
    private router: Router, 
    private location: Location,
    private crearuser: ApiService,
    private alertcontroller: AlertController
  ) {}

nombre: string = '';
apellido: string = '';
rut: string = '';
fechaNacimiento: string = '';
telefono: string = '';
token: string = '';
email: string = '';
password: string = '';

archivoImagen: File | null = null;

  ngOnInit() {
  }

  
  
  async registrar() {
    try {
      let usuario = await this.firebase.registrar(this.email, this.password);
      const token = await usuario.user?.getIdToken();
      if (this.archivoImagen) {
        const request = await this.crearuser.agregarUsuario(
          {
            p_correo_electronico: this.email,
            p_nombre: this.nombre,
            p_telefono: this.telefono,
            token: token,
          },

          this.archivoImagen
        );
      }
      console.log(usuario);
      this.router.navigateByUrl('login');
    } catch (error) {
      this.popAlert();
      console.log(error);
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }

  async popAlert() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'Usuario o Contraseña incorrecta',
      buttons: ['Ok'],
    });
    await alert.present();
  }

  goBack() {
    this.location.back();
  }

}
