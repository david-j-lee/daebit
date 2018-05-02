import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from 'account/services/account.service';

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  constructor(
    private title: Title,
    private router: Router,
    private userService: AccountService
  ) {}

  ngOnInit() {
    this.title.setTitle('Daebit - Change Password');
  }

  changePassword({ value, valid }: { value: any; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    this.userService
      .changePassword(value.oldPassword, value.newPassword)
      .finally(() => (this.isRequesting = false))
      .subscribe(
        (result: any) => {
          if (result) {
            this.router.navigateByUrl('/users/me');
          }
        },
        (errors: any) => {
          this.errors = errors;
        }
      );
  }
}
