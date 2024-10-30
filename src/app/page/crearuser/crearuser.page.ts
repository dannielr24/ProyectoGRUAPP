import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/service/api.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-crearuser',
  templateUrl: './crearuser.page.html',
  styleUrls: ['./crearuser.page.scss'],
})
export class CrearuserPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  fechaNacimiento: {day: number; month: number; year: number} = {day: 0, month: 0, year: 0};
  telefono: string = '';
  token: string = '';
  email: string = '';
  password: string = '';
  archivoImagen: File | null = null;

  registerForm!: FormGroup;
  days: number[] = [];
  months = [
    {value: 1, name: 'Enero'}, {value: 2, name: 'Febrero'}, {value: 3, name: 'Marzo'},
    {value: 4, name: 'Abril'}, {value: 5, name: 'Mayo'}, {value: 6, name: 'Junio'},
    {value: 7, name: 'Julio'}, {value: 8, name: 'Agosto'}, {value: 9, name: 'Septiembre'},
    {value: 10, name: 'Octubre'}, {value: 11, name: 'Noviembre'}, {value: 12, name: 'Diciembre'},
  ]; 
  years: number[] = [];

  constructor(
    private firebase: FirebaseService, 
    private router: Router, 
    private location: Location,
    private crearuser: ApiService,
    private alertcontroller: AlertController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeDateOptions();

    // Definición del formulario de registro
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rut: ['', Validators.required],
      telefono: ['', Validators.required],
      dia: ['', Validators.required],
      mes: ['', Validators.required],
      anio: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [this.passwordMatchValidator, this.dateValidator]
    });
  }

  // Inicializa los valores de días y años
  initializeDateOptions() {
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  }

  // Valida que las contraseñas coincidan
  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Validación personalizada para la fecha de nacimiento
  dateValidator(formGroup: AbstractControl): ValidationErrors | null {
    const dia = formGroup.get('dia')?.value;
    const mes = formGroup.get('mes')?.value;
    const anio = formGroup.get('anio')?.value;

    if (dia && mes && anio) {
      const date = new Date(anio, mes - 1, dia);
      if (date && date.getDate() === dia && date.getMonth() === mes - 1 && date.getFullYear() === anio) {
        return null;
      } else {
        return { dateInvalid: true };
      }
    }
    return { dateInvalid: true };
  }

  // Comprueba si la fecha de nacimiento es inválida
  get dateOfBirthInvalid(): boolean {
    return this.registerForm.hasError('dateInvalid') && !!this.registerForm.get('dia')?.touched;
  }

  // Método para registrar un nuevo usuario
  async registrar() {
    try {
      let usuario = await this.firebase.registrar(this.email, this.password);
      const token = await usuario.user?.getIdToken();

      // Carga de imagen de perfil
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

  // Manejo de la carga de archivo de imagen
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }

  // Alerta de error de registro
  async popAlert() {
    const alert = await this.alertcontroller.create({
      header: 'Error',
      message: 'Usuario o Contraseña incorrecta',
      buttons: ['Ok'],
    });
    await alert.present();
  }

  // Método para retroceder a la página anterior
  goBack() {
    this.location.back();
  }
}
