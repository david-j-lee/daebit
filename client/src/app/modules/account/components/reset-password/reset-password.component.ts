import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Register } from 'account/interfaces/register.interface';
import { AccountService } from 'account/services/account.service';
import { ResetPassword } from 'account/interfaces/reset-password.interface';

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  code = '';
  userId = '';

  constructor(
    private title: Title,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.title.setTitle('Daebit - Reset Password');
    this.code = this.activatedRoute.snapshot.queryParams['code'];
    this.userId = this.activatedRoute.snapshot.queryParams['userId'];
  }

  ngOnInit() {}

  resetPassword({ value, valid }: { value: any; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.accountService
        .resetPassword(this.code, this.userId, value.password)
        .finally(() => (this.isRequesting = false))
        .subscribe((result: any) => {
          if (result) {
            this.router.navigate(['/account/login']);
            // this.router.navigate(['/login'], { queryParams: { brandNew: true, email: value.email } });
          }
        }, (errors: any) => (this.errors = errors));
    }
  }
}
