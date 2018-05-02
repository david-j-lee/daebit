import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import { NavbarService } from 'ui/navbar/navbar.service';

@Component({
  selector: 'app-user',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  constructor(private title: Title, private navbarService: NavbarService) {
    this.title.setTitle('Daebit - Users');
    this.navbarService.setToActive(null);
  }

  ngOnInit() {}
}
