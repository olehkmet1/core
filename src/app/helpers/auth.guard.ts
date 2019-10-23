import {Injectable} from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (
      !this.authService.isAuthenticated()
    ) {
      this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
    return true;
  }
}
