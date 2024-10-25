import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Viaje } from '../models/viaje.model';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {
  viaje?: Viaje; // Variable para almacenar los detalles del viaje

  constructor(private router: Router, private location: Location) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.viaje = navigation?.extras?.state['viaje'];
    }
  }

  ngOnInit() {}

  goBack() {
    this.location.back(); // Volver a la página anterior
  }
}

