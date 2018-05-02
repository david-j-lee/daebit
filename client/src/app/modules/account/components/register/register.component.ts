import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Register } from 'account/interfaces/register.interface';
import { AccountService } from 'account/services/account.service';

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  returnUrl = '';
  errors: string;
  isRequesting: boolean;
  submitted = false;

  constructor(
    private title: Title,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.title.setTitle('Daebit - Register');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  register({ value, valid }: { value: Register; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.accountService
        .register(value.email, value.password, value.firstName, value.lastName)
        .finally(() => (this.isRequesting = false))
        .subscribe((result: any) => {
          if (result) {
            if (this.returnUrl) {
              this.router.navigate([this.returnUrl]);
            } else {
              this.router.navigate(['/apps']);
            }
            // this.router.navigate(['/login'], { queryParams: { brandNew: true, email: value.email } });
          }
        }, (errors: any) => (this.errors = errors));
    }
  }
}
