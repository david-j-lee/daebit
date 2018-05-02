import { Component, OnInit } from '@angular/core';

import { NavbarService } from 'ui/navbar/navbar.service';
import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { GradebookService } from 'gradebook/services/gradebook.service';

import { Class } from 'gradebook/interfaces/class.interface';
import { User } from 'account/interfaces/user.interface';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    showArchivedBudgets = false;
    showArchivedClasses = false;

    constructor(
        public navbarService: NavbarService,
        public userService: AccountService,
        public financeService: FinanceService,
        public gradebookService: GradebookService,
        private accountService: AccountService
    ) {
    }

    ngOnInit() {
    }

    toggleArchivedBudgets() {
        this.showArchivedBudgets = !this.showArchivedBudgets;
    }

    toggleArchivedClasses() {
        this.showArchivedClasses = !this.showArchivedClasses;
    }

    logout() {
        this.accountService.logout();
    }
}
