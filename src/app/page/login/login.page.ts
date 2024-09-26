import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email=""
  password=""
  usuarioService: any;

  constructor(private firebase:FirebaseService, private router:Router, private alertcontroller:AlertController, private location: Location) {}

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

  async login(){
    try {
      let usuario=await this.firebase.auth(this.email,this.password);
      console.log(usuario);
      const navigationextras:NavigationExtras = {
        queryParams: {email: this.email}
      };
      this.router.navigate(['/principal'],navigationextras);
    } catch (error){
      console.log(error);
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
