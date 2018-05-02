import { Component, OnInit } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';

import { ExpenseEditComponent } from 'finance/components/expenses/expense-edit/expense-edit.component';

@Component({
  selector: 'app-expense-table',
  templateUrl: 'expense-table.component.html',
  styleUrls: ['expense-table.component.scss']
})
export class ExpenseTableComponent implements OnInit {
  constructor(
    public financeService: FinanceService
  ) {}

  ngOnInit() {}
}
