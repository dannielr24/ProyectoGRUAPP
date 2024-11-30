import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';  // Importa el servicio ApiService
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Formulario reactivo para validaciones
import { Location } from '@angular/common';

@Component({
  selector: 'app-agregar-viaje',
  templateUrl: './agregar-viaje.page.html',
  styleUrls: ['./agregar-viaje.page.scss'],
})
export class AgregarViajePage implements OnInit {
  // Definir el formulario reactivo
  agregarViajeForm: FormGroup;

  constructor(
    private apiService: ApiService,  // Inyección del servicio
    private formBuilder: FormBuilder, // Inyección de FormBuilder para el manejo del formulario reactivo
    private location: Location
  ) { 
    // Inicialización del formulario con validaciones
    this.agregarViajeForm = this.formBuilder.group({
      p_id_usuario: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Validación: solo números
      p_ubicacion_origen: ['', Validators.required],  // Ubicación origen es obligatoria
      p_ubicacion_destino: ['', Validators.required],  // Ubicación destino es obligatoria
      p_costo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],  // Costo debe ser un número
      p_id_vehiculo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],  // ID de vehículo debe ser numérico
      token: ['', Validators.required]  // Token es obligatorio
    });
  }

  ngOnInit() {
    // Cualquier lógica adicional que se necesite al inicializar la página.
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    if (this.agregarViajeForm.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const viajeData = this.agregarViajeForm.value;

    try {
      // Llamamos al servicio para agregar un viaje
      const response = await this.apiService.agregarViaje(viajeData);
      if (response.success) {
        alert('Viaje agregado con éxito.');
        this.agregarViajeForm.reset(); // Reseteamos el formulario si la solicitud es exitosa
      } else {
        alert('Ocurrió un error al agregar el viaje.');
      }
    } catch (error) {
      console.error('Error al agregar el viaje:', error);
      alert('Hubo un problema al agregar el viaje. Intente nuevamente.');
    }
  }

  // Método para retroceder a la página anterior
  goBack() {
    this.location.back();
  }
}
