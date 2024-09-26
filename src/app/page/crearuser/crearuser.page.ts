import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crearuser',
  templateUrl: './crearuser.page.html',
  styleUrls: ['./crearuser.page.scss'],
})
export class CrearuserPage implements OnInit {

  constructor(private firebase:FirebaseService, private router:Router, private location: Location) { }

email=""
password=""

  ngOnInit() {
  }

  async registrar(){
      let usuario=await this.firebase.registrar(this.email,this.password);
      console.log(usuario);
      this.router.navigateByUrl("login")
  }

  goBack() {
    this.location.back();
  }

}
