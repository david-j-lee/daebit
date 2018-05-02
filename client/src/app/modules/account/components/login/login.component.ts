import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/finally';

import { fadeInAnimation } from 'core/animations/fade-in.animation';

import { Login } from 'account/interfaces/login.interface';
import { AccountService } from 'account/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  animations: [fadeInAnimation]
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  errors: string;
  isRequesting: boolean;
  submitted = false;

  constructor(
    private title: Title,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.title.setTitle('Daebit - Login');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  login({ value, valid }: { value: Login; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.accountService
        .login(value.email, value.password)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              if (this.returnUrl) {
                this.router.navigateByUrl(this.returnUrl);
              } else {
                this.router.navigateByUrl('/apps');
              }
            }
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }
}
