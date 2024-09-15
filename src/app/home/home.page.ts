import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {

  constructor(private router: Router) {}

  goToAccount(page: String) {
    this.router.navigate([`/${page}`])
  }

  goToPage(page: string){
    this.router.navigate([page]);
  }

  navigateToService() {
    this.router.navigate(['/mapa']);
  }
  
}
