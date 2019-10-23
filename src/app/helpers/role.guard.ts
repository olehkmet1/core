import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  constructor(public authService: AuthService,
              private router: Router) {
  }

  canActivate(): boolean {
    const currentRole = (localStorage.getItem('role') === 'true');

    if (
      !this.authService.isAuthenticated() || !currentRole
    ) {
      this.router.navigate(['403']);
      return false;
    }
    return true;
  }
}
