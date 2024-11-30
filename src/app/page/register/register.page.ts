import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirebaseService } from '../../service/firebase.service';
import { UsuarioService } from 'src/app/services/usuario.service';  // Importamos el servicio

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  fechaNacimiento: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router, 
    private firebaseService: FirebaseService,
    private usuarioService: UsuarioService  // Inyectamos el servicio
  ) {}

  async register() {
    try {
      // Llamar al servicio para registrar al usuario
      const usuario = await this.firebaseService.registrar(this.email, this.password, this.nombre, this.apellido, this.rut, this.fechaNacimiento);
      console.log('Usuario registrado correctamente:', usuario);

      // Obtener el UID del usuario recién registrado
      const uid = usuario.user?.uid;
      
      if (uid) {
        // Guardar el usuario en localStorage
        this.usuarioService.saveUser(uid, this.email, this.nombre, this.apellido); // Usamos saveUser
      }

      // Obtener el token del usuario
      const token = await usuario.user?.getIdToken();
      console.log('Token de usuario:', token);

      // Redirigir al usuario después del registro
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      // Aquí podrías mostrar un mensaje de error al usuario si es necesario
    }
  }
}
