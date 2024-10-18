import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-solicitar-grua',
  templateUrl: './solicitar-grua.page.html',
  styleUrls: ['./solicitar-grua.page.scss'],
})
export class SolicitarGruaPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  solicitarGrua() {
    console.log('Solicitud de grúa enviada');
  }

}
