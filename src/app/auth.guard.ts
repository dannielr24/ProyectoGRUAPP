import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { FirebaseService } from './service/firebase.service';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {
  constructor(private authService: FirebaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.isUserLoggedIn();
    if (user) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }      
  }
}
