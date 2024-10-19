import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-ruta-moto',
  templateUrl: './ruta-moto.page.html',
  styleUrls: ['./ruta-moto.page.scss'],
})
export class RutaMotoPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private loggingService: LoggingService
  ) {}

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  iniciarViaje() {
    this.loggingService.log('Viaje en moto iniciado');
  }

}
