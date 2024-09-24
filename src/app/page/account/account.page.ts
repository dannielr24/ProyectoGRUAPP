import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
  }

  goToAccount(page: string) {
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }

  goToPage(page: string) {
    this.router.navigate([page]);
  }

}
