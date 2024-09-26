import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  viajes = [
    { tipo: 'Auto', fecha: '2024-09-24', origen: 'Punto A', destino: 'Punto B', estado: 'Completado' },
    { tipo: 'Moto', fecha: '2024-09-23', origen: 'Punto C', destino: 'Punto D', estado: 'Cancelado' },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  solicitarGrua() {
    console.log('Solicitud de grúa realizada');
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  goToAccount(page: String) {
    this.router.navigate([`/${page}`])
  }

}
