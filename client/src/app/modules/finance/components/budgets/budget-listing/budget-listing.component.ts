import { Component, OnInit } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';

import { BudgetAddComponent } from 'app/modules/finance/components/budgets/budget-add/budget-add.component';

@Component({
  selector: 'app-budget-listing',
  templateUrl: './budget-listing.component.html',
  styleUrls: ['./budget-listing.component.scss']
})
export class BudgetListingComponent implements OnInit {
  constructor(
    public financeService: FinanceService
  ) { }

  ngOnInit() { }
}
