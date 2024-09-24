import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private menu: MenuController) {}


  goToAccount(page: String) {
    this.router.navigate([`/${page}`])
  }

  goToPage(page: string){
    this.router.navigate([page]);
  }

  navigateToService() {
    this.router.navigate(['/mapa']);
  }

  openMenu() {
    this.menu.open(); // Abre el menú
  }
  
}
