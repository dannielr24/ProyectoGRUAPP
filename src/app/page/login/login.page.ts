import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private storageService: StorageService, 
    private firebase: FirebaseService,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    const uid = await this.storageService.getItem('uid');
    if (!uid) {
      await this.storageService.limpiarStorage(); // Solo limpiar si no hay UID
    }
  }

  async login() {
    if (!this.email || !this.password) {
      await this.mostrarMensaje('Error', 'Por favor ingresa email y contraseña');
      return;
    }
  
    try {
      const usuario = await this.firebase.auth(this.email, this.password);
      if (!usuario.user) {
        throw new Error('No se pudo autenticar el usuario');
      }
  
      this.tokenID = await usuario.user.getIdToken();
      
      try {
        const userInfo = await this.apiService.obtenerUsuario({
          p_correo: this.email,
          token: this.tokenID
        });
  
        console.log('Información del usuario:', userInfo);
  
        if (!userInfo?.data?.length) {
          try {
            const nombreUsuario = this.email.split('@')[0];
            const userData = {
              p_nombre: nombreUsuario,
              p_correo_electronico: this.email,
              p_telefono: "0000000000",
              token: this.tokenID,
            };
  
            console.log('Intentando registrar usuario con datos:', userData);
            const registroResponse = await this.apiService.agregarUsuario(userData);
            console.log('Respuesta del registro:', registroResponse);
  
            // Cambiar esta verificación
            if (registroResponse?.message === 'Usuario agregado correctamente!') {
              // Obtener el usuario nuevamente después del registro
              const nuevoUserInfo = await this.apiService.obtenerUsuario({
                p_correo: this.email,
                token: this.tokenID
              });
  
              if (nuevoUserInfo?.data?.length > 0) {
                await this.storageService.agregarStorage({
                  email: this.email,
                  token: this.tokenID,
                  idUsuario: nuevoUserInfo.data[0].id
                });
                
                this.router.navigate(['/principal']);
              } else {
                throw new Error('No se pudo obtener la información del usuario después del registro');
              }
            } else {
              throw new Error(registroResponse?.message || 'No se pudo registrar el usuario');
            }
          } catch (registroError: any) {
            console.error('Error al registrar usuario:', registroError);
            const mensajeError = registroError?.message || 'No se pudo completar el registro';
            await this.mostrarMensaje('Error', mensajeError);
            return;
          }
        } else {
          // Usuario existe, guardar datos y continuar
          await this.storageService.agregarStorage({
            email: this.email,
            token: this.tokenID,
            idUsuario: userInfo.data[0].id
          });
  
          this.router.navigate(['/principal']);
        }
      } catch (apiError) {
        console.error("Error al obtener datos del usuario:", apiError);
        await this.mostrarMensaje('Error', 'Error al obtener información del usuario');
      }
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      let mensaje = 'Error al iniciar sesión';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
            mensaje = 'Credenciales inválidas. Verifica tu email y contraseña.';
            break;
          case 'auth/user-not-found':
            mensaje = 'Usuario no encontrado.';
            break;
          case 'auth/wrong-password':
            mensaje = 'Contraseña incorrecta.';
            break;
          case 'auth/invalid-email':
            mensaje = 'Email inválido.';
            break;
          default:
            mensaje = 'Error al iniciar sesión: ' + error.message;
        }
      }
      
      await this.mostrarMensaje('Error', mensaje);
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

  goBack() {
    this.router.navigate(['/home']);
  }
}