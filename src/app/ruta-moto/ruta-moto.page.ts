import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ruta-moto',
  templateUrl: './ruta-moto.page.html',
  styleUrls: ['./ruta-moto.page.scss'],
})
export class RutaMotoPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
  }

  iniciarViaje() {
    this.router.navigate(['/mapa']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

}
