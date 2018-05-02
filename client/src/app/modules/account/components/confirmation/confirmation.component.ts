import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Register } from 'account/interfaces/register.interface';
import { AccountService } from 'account/services/account.service';
import { ForgotPassword } from 'account/interfaces/forgot-password.interface';

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  constructor(
    private title: Title,
    private accountService: AccountService,
    private router: Router
  ) {
    this.title.setTitle('Daebit - Forgot Password Confirmation');
  }

  ngOnInit() {}
}
