import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent  implements OnInit {

  constructor(
    private fireBaseService: FirebaseService,
    private router: Router
  ) {}

  async logout() {
    await this.fireBaseService.logout();
    this.router.navigate(['/principal']);
  }

  ngOnInit() {}

  goToAccount(page: string) {
    this.router.navigate([`/${page}`]); 
  }

}
