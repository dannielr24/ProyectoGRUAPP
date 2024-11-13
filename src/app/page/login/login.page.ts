import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email=""
  password=""
  usuarioService: any;
  tokenID: any="";

  constructor(
    private firebase:FirebaseService, 
    private router:Router, 
    private alertcontroller:AlertController, 
    private location: Location, 
    private storage: StorageService
  ) {}

  singIn() {
    const usuarioLogueado = {
      nombre: 'Daniel',
      sexo: 'M',
    };
    
    this.usuarioService.setUsuario(usuarioLogueado);

    this.router.navigate(['/account']); 
  }

  ngOnInit() {
  }

  async login() {
    try {
      let user = await this.firebase.auth(this.email, this.password);
      this.tokenID = await user.user?.getIdToken() || "";
  
      // Guardar `user.uid` en vez de `tokenID`
      const uid = user.user?.uid;
  
      if (this.tokenID && uid) {
        // Almacenar el uid en vez del tokenID
        this.storage.set('uid', uid);
        this.storage.set('email', this.email);
  
        // Guardar el nombre del usuario usando `uid`
        this.storage.setUserName(uid, 'Daniel'); // Cambia 'Daniel' por el nombre dinámico si lo tienes
      } else {
        console.error('Error: No se pudo obtener el uid o tokenID');
      }
  
      this.router.navigate(['/principal']);
    } catch (error) {
      console.error('Error durante el login:', error);
      this.popAlert();
    }
  }

  async popAlert() {
    const alert=await this.alertcontroller.create({
      header:'Error',
      message:"Usuario o contraseña incorrecta",
      buttons:['Ok']
    })
    await alert.present();
  }

  goBack() {
    this.location.back();
  }
}
