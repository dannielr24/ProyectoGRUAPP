import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-ruta-auto',
  templateUrl: './ruta-auto.page.html',
  styleUrls: ['./ruta-auto.page.scss'],
})
export class RutaAutoPage implements OnInit {

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
    this.loggingService.log("Viaje en auto iniciado");
  }

}
