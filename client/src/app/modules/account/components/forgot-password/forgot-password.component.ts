import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from 'account/services/account.service';
import { ForgotPassword } from 'account/interfaces/forgot-password.interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  constructor(
    private title: Title,
    private router: Router,
    private accountService: AccountService
  ) {
    this.title.setTitle('Daebit - Forgot Password');
  }

  ngOnInit() {}

  forgotPassword({ value, valid }: { value: ForgotPassword; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.accountService
        .forgotPassword(value.email)
        .finally(() => (this.isRequesting = false))
        .subscribe((result: any) => {
          if (result) {
            this.router.navigate(['/account/confirmation']);
            // this.router.navigate(['/login'], { queryParams: { brandNew: true, email: value.email } });
          }
        }, (errors: any) => (this.errors = errors));
    }
  }
}
