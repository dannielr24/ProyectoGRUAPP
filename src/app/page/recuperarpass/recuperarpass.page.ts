import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-recuperarpass',
  templateUrl: './recuperarpass.page.html',
  styleUrls: ['./recuperarpass.page.scss'],
})
export class RecuperarpassPage implements OnInit {

  email=""
  password=""

  constructor(private firebase:FirebaseService, private router:Router) { }

  ngOnInit() {
  }

  async recuperar(){
    let usuario=await this.firebase.recuperar(this.email);
    console.log(usuario);
    this.router.navigateByUrl("login")
}

}
