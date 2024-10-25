import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ruta-auto',
  templateUrl: './ruta-auto.page.html',
  styleUrls: ['./ruta-auto.page.scss'],
})
export class RutaAutoPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
  }

  iniciarViaje() {
    console.log("Iniciando viaje en auto");
    this.router.navigate(['/mapa']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

}
