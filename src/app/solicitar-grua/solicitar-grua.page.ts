import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-solicitar-grua',
  templateUrl: './solicitar-grua.page.html',
  styleUrls: ['./solicitar-grua.page.scss'],
})
export class SolicitarGruaPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private loggingService: LoggingService
  ) {}

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  solicitarGrua() {
    this.loggingService.log('Solicitud de grúa enviada');
  }

}
