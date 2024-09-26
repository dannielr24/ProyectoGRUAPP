import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  email: string=""

  user: any;

  constructor(private firebase:FirebaseService, private router:Router, private activate:ActivatedRoute, private location: Location) { 
    this.activate.queryParams.subscribe(params => {
    this.email=params['email'];
    console.log(this.email);

    this.user = {
      email: this.email
    }
    })
  }

  ngOnInit() {
  }

  async logout(){
    await this.firebase.logout();
    this.router.navigateByUrl('login');
  }

  navigateTo(page: string){
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }

}
