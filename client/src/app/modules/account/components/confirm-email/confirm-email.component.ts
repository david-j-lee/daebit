import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AccountService } from 'account/services/account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  showLogin = false;

  code = '';
  userId = '';

  message = 'Confirming your email';

  constructor(
    private title: Title,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.title.setTitle('Daebit - Forgot Password');
    this.userId = this.activatedRoute.snapshot.queryParams['userId'];
    this.code = this.activatedRoute.snapshot.queryParams['code'];
  }

  ngOnInit(): void {
    this.accountService
      .confirmEmail(this.userId, this.code)
      .subscribe((result: any) => {
        if (result) {
          this.message = 'Your email has been confirmed';
          this.showLogin = true;
        } else {
          this.message = 'Unable to confirm your email';
        }
      }, (errors: any) => (this.message = 'Unable to confirm your email'));
  }
}
