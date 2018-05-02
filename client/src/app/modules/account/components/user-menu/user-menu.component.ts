import { Component, OnInit } from '@angular/core';

import { AccountService } from 'account/services/account.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  constructor(private accountService: AccountService) {}

  ngOnInit() {}

  logout() {
    this.accountService.logout();
  }
}
