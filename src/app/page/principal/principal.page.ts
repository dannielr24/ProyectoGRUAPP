import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  email: string=""
  pass: number=0
  valor: number=0
  user: any;

  constructor(private firebase:FirebaseService, private router:Router, private activate:ActivatedRoute) { 
    this.activate.queryParams.subscribe(params => {
    this.email=params['email'];
    this.pass=params['password'];
    this.valor=params['valor'];
    console.log(this.email,this.pass);

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

}
