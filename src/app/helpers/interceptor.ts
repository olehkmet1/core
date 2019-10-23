import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(public auth: AuthService,
              public router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const expires = localStorage.getItem('expiresIn');

    if (request.url.indexOf('i18n') >= 0) {
      return next.handle(request);
    }

    if (this.auth.isAuthenticated() && Number(expires) <= (new Date().getTime() / 1000)) {
      this.auth.createRefreshToken();
    }

    return next.handle(request.clone({
      setHeaders: {
        Accept: `application/json`,
        'Accept-Language': 'en-US,en;q=0.9',
        Authorization: `Bearer ${this.auth.getAccessToken()}`,
        'Content-Type': `application/json`,
      }
    })).pipe(tap((event: HttpEvent<any>) => {
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['/sign-in']);
        }
      }
    }));
  }
}
