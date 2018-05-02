/*
	This guard only protects the all routes except the setup routes
	This is because the setup route does not require a company and only a user
	whereas the app guard requires both a user and a company
*/

import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AccountService } from 'account/services/account.service';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const url: string = state.url;
    // check for token
    if (!this.accountService.isLoggedIn) {
      this.router.navigate([`/account/login${url}`]);
      return Observable.of(false);
    }

    return this.accountService
      .getMe()
      .map((user: any) => {
        return true;
      })
      .catch((err: any) => {
        this.router.navigate([`/account/login${url}`]);
        return Observable.of(false); // some reason error if not observable for, false only
      });
  }
}
