import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  @Output() signInErrorOccurred = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  public createAccessToken(data) {
    return this.httpClient.post(this.apiUrl + 'Account/token', data);
  }

  public createRefreshToken() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const data = {
      token: accessToken,
      refreshToken: refreshToken,
    };

    this.httpClient.post(this.apiUrl + 'Account/refresh-token', data)
      .subscribe(res => {
          localStorage.setItem('accessToken', res['token']);
          localStorage.setItem('refreshToken', res['refreshToken']);
          localStorage.setItem('expiresIn', res['expirationDate'] + new Date().getTime() / 1000);
        },
        error => {
          this.signInErrorOccurred.emit(error);
        });
  }

  public resetPassword(data) {
    return this.httpClient.post(this.apiUrl + 'Account/forgot', data);
  }

  public createPassword(data) {
    return this.httpClient.post(this.apiUrl + 'Account/reset', data);
  }

  public confirmEmail(data) {
    return this.httpClient.post(this.apiUrl + 'Account/confirm', data);
  }

  public isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    return accessToken !== 'undefined' && accessToken !== undefined && accessToken !== null
      && refreshToken !== 'undefined' && refreshToken !== undefined && refreshToken !== null;
  }

  public getAccessToken() {
    return localStorage.getItem('accessToken');
  }



  public getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      return null;
    }
  }
}
