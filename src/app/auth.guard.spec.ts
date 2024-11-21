import { TestBed } from '@angular/core/testing';
import { CanActivate, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { of } from 'rxjs';
import { FirebaseService } from './service/firebase.service';


describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<FirebaseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('FirebaseService', ['isUserLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: FirebaseService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', async () => {
    authServiceSpy.isUserLoggedIn.and.returnValue(Promise.resolve(true));
    const result = await guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should navigate to /login if user is not logged in', async () => {
    authServiceSpy.isUserLoggedIn.and.returnValue(Promise.resolve(false));
    const result = await guard.canActivate();
    expect(result).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
