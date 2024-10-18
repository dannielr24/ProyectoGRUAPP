import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ruta-auto',
  templateUrl: './ruta-auto.page.html',
  styleUrls: ['./ruta-auto.page.scss'],
})
export class RutaAutoPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  iniciarViaje() {
    console.log("Viaje en auto iniciado");
  }

}
