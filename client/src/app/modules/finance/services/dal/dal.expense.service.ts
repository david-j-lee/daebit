/*
This data access layer handles all the business logic after an webAPI call
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WebApiExpenseService } from './../web-api/web-api.expense.service';
import { FinanceService } from 'finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

import { Expense } from 'finance/interfaces/expenses/expense.interface';
import { ExpenseAdd } from 'finance/interfaces/expenses/expense-add.interface';
import { ExpenseEdit } from 'finance/interfaces/expenses/expense-edit.interface';

@Injectable()
export class DalExpenseService {
  constructor(
    private webApiExpenseService: WebApiExpenseService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService
  ) {}

  getAll(budgetId: number): Observable<any> {
    return this.webApiExpenseService.getAll(budgetId).map(result => {
      return result;
    });
  }

  add(value: ExpenseAdd) {
    value.budgetId = this.financeService.selectedBudget.id;
    return this.webApiExpenseService.add(value).map(result => {
      // add new class locally
      const newExpense: Expense = {
        id: result,
        description: value.description,
        amount: value.amount,
        isForever: value.isForever,
        frequency: value.frequency,
        startDate: value.startDate,
        endDate: value.endDate,
        repeatMon: value.repeatMon,
        repeatTue: value.repeatTue,
        repeatWed: value.repeatWed,
        repeatThu: value.repeatThu,
        repeatFri: value.repeatFri,
        repeatSat: value.repeatSat,
        repeatSun: value.repeatSun,
        yearlyAmount: 0,
        dailyExpenses: []
      };

      this.financeService.selectedBudget.expenses.push(newExpense);

      // generate daily data and update charts
      this.dailyService.generateExpense(newExpense);
      newExpense.yearlyAmount = this.dailyService.getYearlyAmountExpense(
        newExpense
      );

      this.dailyService.setRunningTotals();
      this.chartService.setChartExpense();
      this.chartService.setChartBudget();

      return Observable.of(true);
    });
  }

  update(oldExpense: Expense, newExpense: ExpenseEdit) {
    newExpense.id = oldExpense.id;
    return this.webApiExpenseService.update(newExpense).map(result => {
      oldExpense.description = newExpense.description;
      oldExpense.amount = newExpense.amount;
      oldExpense.isForever = newExpense.isForever;
      oldExpense.frequency = newExpense.frequency;
      oldExpense.startDate = newExpense.startDate;
      oldExpense.endDate = newExpense.endDate;
      oldExpense.repeatMon = newExpense.repeatMon;
      oldExpense.repeatTue = newExpense.repeatTue;
      oldExpense.repeatWed = newExpense.repeatWed;
      oldExpense.repeatThu = newExpense.repeatThu;
      oldExpense.repeatFri = newExpense.repeatFri;
      oldExpense.repeatSat = newExpense.repeatSat;
      oldExpense.repeatSun = newExpense.repeatSun;

      // update all
      this.dailyService.deleteExpense(oldExpense);
      this.dailyService.generateExpense(oldExpense);
      oldExpense.yearlyAmount = this.dailyService.getYearlyAmountExpense(
        oldExpense
      );
      this.dailyService.setRunningTotals();
      this.chartService.setChartExpense();
      this.chartService.setChartBudget();
      return Observable.of(true);
    });
  }

  delete(id: number) {
    return this.webApiExpenseService.delete(id).map(result => {
      if (this.financeService.selectedBudget.expenses) {
        const deletedExpense = this.financeService.selectedBudget.expenses.find(
          data => data.id === id
        );
        if (deletedExpense) {
          this.financeService.selectedBudget.expenses.splice(
            this.financeService.selectedBudget.expenses.indexOf(deletedExpense),
            1
          );

          // delete daily data and update charts
          this.dailyService.deleteExpense(deletedExpense);
          this.dailyService.setRunningTotals();
          this.chartService.setChartExpense();
          this.chartService.setChartBudget();
        }
      }
    });
  }
}
