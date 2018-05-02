import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { AccountService } from 'account/services/account.service';
import { ThemeService } from 'material/services/theme.service';

import { User } from 'account/interfaces/user.interface';
import { UserEdit } from 'account/interfaces/user-edit.interface';
import { Theme } from 'material/interfaces/theme.interface';

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  public user: User;

  constructor(
    private title: Title,
    private matSnackBar: MatSnackBar,
    private userService: AccountService,
    private themeService: ThemeService
  ) {
    this.title.setTitle('Daebit - Edit User');
  }

  ngOnInit() {
    this.userService.getMe().subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
  }

  edit({ value, valid }: { value: User; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.userService
        .edit({
          id: this.user.id,
          firstName: value.firstName,
          lastName: value.lastName,
          email: this.user.email, // TODO: allow users to change their email
          theme: this.themeService.selectedTheme.name
        } as UserEdit)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
            }
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }

  public selectTheme(theme: Theme) {
    this.themeService.selectedTheme = theme;
  }
}
