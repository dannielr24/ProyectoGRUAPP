// auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private userData = new BehaviorSubject<any>(null);


  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
        this.userData.next(user);
    });
  }

  get currentUser() {
    return this.userData.asObservable();
  }

  async logout() {
    await this.afAuth.signOut();
    this.userData.next(null);
  }
}
