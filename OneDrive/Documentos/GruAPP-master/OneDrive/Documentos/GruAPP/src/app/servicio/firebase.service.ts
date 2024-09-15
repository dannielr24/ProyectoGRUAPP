import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 constructor(private firebase:AngularFireAuth) { }

 async auth(email:string, password:string){
    const request=await this.firebase.signInWithEmailAndPassword(email,password);
    return request
 }

 async logout(){
  await this.firebase.signOut();
 }
}
