import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-solicitar-grua',
  templateUrl: './solicitar-grua.page.html',
  styleUrls: ['./solicitar-grua.page.scss'],
})
export class SolicitarGruaPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
  }

  solicitarGrua() {
    console.log("Iniciando viaje en grúa");
    this.router.navigate(['/mapa']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

}
