import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { FinanceService } from 'finance/services/finance.service';

import { BudgetAddComponent } from 'finance/components/budgets/budget-add/budget-add.component';
import { BudgetEditComponent } from 'finance/components/budgets/budget-edit/budget-edit.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  showArchivedBudgets = false;

  constructor(
    public matDialog: MatDialog,
    public financeService: FinanceService
  ) {}

  ngOnInit() {}
}
