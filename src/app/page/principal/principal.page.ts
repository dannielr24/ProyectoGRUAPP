import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/service/storage.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  user = {
    email: '',
    name: '' as string | null 
  }

  constructor(
    private firebase: FirebaseService, 
    private router: Router, 
    private activate: ActivatedRoute, 
    private location: Location,
    private storage: StorageService,
    private appComponent: AppComponent
  ) {}

  ngOnInit() {
    const uid = this.storage.get('uid'); // Recupera `uid` en vez del `tokenID`
    console.log('UID recuperado:', uid);
  
    if (uid) {
      const storedName = this.storage.getUserName(uid);
      if (storedName) {
        this.user.name = storedName;
        console.log('Nombre recuperado en principal:', this.user.name);
      } else {
        console.log('No se encontró el nombre en el storage');
        this.user.name = 'Usuario desconocido';
      }
    } else {
      console.error('Error: uid no encontrado o es inválido');
      this.user.name = 'Usuario desconocido';
    }
  }  

  logout(){
    this.appComponent.confirmLogout();
  }

  navigateTo(page: string){
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }

}
