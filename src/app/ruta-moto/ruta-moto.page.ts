import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ruta-moto',
  templateUrl: './ruta-moto.page.html',
  styleUrls: ['./ruta-moto.page.scss'],
})
export class RutaMotoPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  iniciarViaje() {
    console.log('Viaje en moto iniciado');
  }

}
