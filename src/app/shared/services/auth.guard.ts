import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { SnackbarService } from '../snackbar.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthenticationService,
              private router: Router,
              private snack: SnackbarService,
              private a: AngularFireAuth) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

        if (this.auth.isloggedIn()) {
          return true;
        }
        else {
          this.router.navigate(['login']);
          return false;
        }



  }
}
