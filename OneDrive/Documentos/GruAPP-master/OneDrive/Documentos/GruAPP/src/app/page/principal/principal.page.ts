import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicio/firebase.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent  implements OnInit {

  constructor(private firebase:FirebaseService) { }

  ngOnInit() {

  }

  async logout(){
    await this.firebase.logout();
  }

}
