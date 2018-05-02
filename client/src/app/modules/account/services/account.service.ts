import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Response, Headers, RequestOptions } from '@angular/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from 'core/services/config.service';
import { BaseService } from 'core/services/base.service';
import { ThemeService } from 'material/services/theme.service';

import { AuthResponse } from 'account/interfaces/auth-response.interface';
import { Register } from 'account/interfaces/register.interface';
import { User } from 'account/interfaces/user.interface';
import { UserEdit } from 'account/interfaces/user-edit.interface';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountService extends BaseService {
  me: User;

  private baseUrl = '';
  private loggedIn = false;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private themeService: ThemeService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    super();
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn = !!localStorage.getItem('auth_token');
    }
    this.baseUrl = configService.getApiURI();
  }

  getMe(): Observable<any> {
    if (this.me === undefined || this.me == null) {
      const url = this.baseUrl + '/users/get';
      return this.http
        .get(url)
        .map((data: any) => {
          this.me = data;
          this.themeService.set(this.me.theme);
          return this.me;
        })
        .catch(this.handleError);
    } else {
      this.themeService.set(this.me.theme);
      return Observable.of(this.me);
    }
  }

  edit(user: UserEdit) {
    const url = this.baseUrl + '/users/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(user);

    return this.http
      .post(url, body, { headers })
      .map((res: any) => {
        this.me.theme = user.theme;
        this.themeService.set(user.theme);
        return true;
      })
      .catch(this.handleError);
  }

  changePassword(oldPassword: string, newPassword: string) {
    const url = `${
      this.baseUrl
    }/users/change-password?oldPassword=${oldPassword}&newPassword=${newPassword}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(url, { headers })
      .map((res: any) => {
        return true;
      })
      .catch(this.handleError);
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<Register> {
    const url = this.baseUrl + '/account/register';
    const body = JSON.stringify({ email, password, firstName, lastName });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(url, body, { headers })
      .map((res: any) => {
        this.setToken(res);
        return true;
      })
      .catch(this.handleError);
  }

  login(email: string, password: string) {
    const url = this.baseUrl + '/account/login';
    const body = JSON.stringify({ email, password });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(url, body, { headers })
      .map((res: any) => {
        this.setToken(res);
        return true;
      })
      .catch(this.handleError);
  }

  confirmEmail(userId: string, code: string) {
    const url = this.baseUrl + '/account/confirm-email';
    const body = JSON.stringify({ userId, code });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(url, body, { headers })
      .map((res: any) => {
        return true;
      })
      .catch(this.handleError);
  }

  forgotPassword(email: string) {
    const url = this.baseUrl + '/account/forgot-password';
    const body = JSON.stringify({ email });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(url, body, { headers })
      .map((res: any) => {
        this.setToken(res);
        return true;
      })
      .catch(this.handleError);
  }

  resetPassword(code: string, userId: string, password: string) {
    const url = this.baseUrl + '/account/reset-password';
    const body = JSON.stringify({ code, userId, password });
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http
      .post(url, body, { headers })
      .map((res: any) => {
        this.setToken(res);
        return true;
      })
      .catch(this.handleError);
  }

  setToken(res: any) {
    this.loggedIn = true;
    localStorage.setItem('token', res.token);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');

    // redirect as we want all var and obj to reset
    window.location.replace('/');
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
