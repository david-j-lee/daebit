import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AccountService } from 'account/services/account.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private accountService: AccountService;

  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // had to use injector to avoid cyclic dependency
    this.accountService = this.injector.get(AccountService);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.accountService.getToken()}`
      }
    });
    return next.handle(request);
  }
}
