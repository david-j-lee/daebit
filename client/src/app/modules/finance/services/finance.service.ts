import { Injectable } from '@angular/core';

import { BaseService } from 'core/services/base.service';

import { Budget } from 'finance/interfaces/budgets/budget.interface';
import { Expense } from 'finance/interfaces/expenses/expense.interface';
import { Revenue } from 'finance/interfaces/revenues/revenue.interface';

import { Moment } from 'moment';
import * as moment from 'moment';

@Injectable()
export class FinanceService {
  budgets: Budget[];
  selectedBudget: Budget;
  isLoaded = false;

  frequencies = ['Once', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Yearly'];

  constructor() {}

  selectBudget(budget: Budget) {
    this.selectedBudget = budget;
  }
}
