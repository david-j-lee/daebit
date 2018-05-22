import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { NavbarService, Modules } from 'ui/navbar/navbar.service';
import { FinanceService } from 'finance/services/finance.service';
import { DalBudgetService } from 'finance/services/dal/dal.budget.service';

import { BudgetAddComponent } from 'finance/components/budgets/budget-add/budget-add.component';
import { BudgetDeleteComponent } from 'finance/components/budgets/budget-delete/budget-delete.component';
import { BudgetEditComponent } from 'finance/components/budgets/budget-edit/budget-edit.component';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  constructor(
    public financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navBarService: NavbarService
  ) {}

  ngOnInit() {
    this.title.setTitle('Daebit - Budgets');
    this.navBarService.setToActive(Modules.budgets);

    this.getBudgets();

    this.activatedRoute.params.subscribe(params => {
      if (params.budgetId === undefined) {
        this.financeService.selectedBudget = undefined;
      }
    });
  }

  private getBudgets() {
    if (this.financeService.budgets === undefined) {
      this.dalBudgetService.getAll().subscribe(result => {
        if (result) {
          this.financeService.budgets = result;
          this.financeService.isLoaded = true;
          return this.financeService.budgets;
        }
      });
    }
  }
}
