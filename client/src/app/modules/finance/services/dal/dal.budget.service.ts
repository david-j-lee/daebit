/*
  This data access layer handles all the business logic after an webAPI call
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WebApiBudgetService } from 'finance/services/web-api/web-api.budget.service';
import { DailyService } from 'finance/services/daily.service';
import { CalendarService } from 'finance/services/calendar.service';
import { ChartService } from 'finance/services/chart.service';
import { FinanceService } from 'finance/services/finance.service';

import { Budget } from 'finance/interfaces/budgets/budget.interface';
import { BudgetAdd } from 'finance/interfaces/budgets/budget-add.interface';
import { BudgetEdit } from 'finance/interfaces/budgets/budget-edit.interface';
import { Snapshot } from 'finance/interfaces/snapshots/snapshot.interface';

@Injectable()
export class DalBudgetService {
  constructor(
    private financeService: FinanceService,
    private chartService: ChartService,
    private dailyService: DailyService,
    private calendarService: CalendarService,
    private webApiBudgetService: WebApiBudgetService
  ) {}

  getAll(): Observable<any> {
    return this.webApiBudgetService.getAll().map(result => {
      return result;
    });
  }

  add(value: BudgetAdd): Observable<any> {
    return this.webApiBudgetService.add(value).map(result => {
      // add new class locally
      const newBudget: Budget = {
        id: result.budgetId,
        isBalancesLoaded: true,
        isRevenuesLoaded: true,
        isExpensesLoaded: true,
        isSnapshotsLoaded: true,
        name: value.name,
        startDate: value.startDate,
        isActive: true,
        balances: [],
        revenues: [],
        expenses: [],
        snapshots: [],
        days: []
      };
      this.financeService.budgets.push(newBudget);
      this.financeService.selectBudget(newBudget);
      this.dailyService.generateDailyBudget();
      this.chartService.setChartBalance();
      this.chartService.setChartRevenue();
      this.chartService.setChartExpense();
      this.chartService.setChartBudget();
      this.calendarService.setFirstMonth();

      // add new snapshot
      const newSnapshot: Snapshot = {
        id: result.snapshotId,
        date: value.startDate,
        actualBalance: 0,
        estimatedBalance: 0,
        balanceDifference: 0
      };
      this.financeService.selectedBudget.snapshots.push(newSnapshot);
    });
  }

  update(oldBudget: Budget, newBudget: BudgetEdit): Observable<any> {
    newBudget.id = oldBudget.id;
    return this.webApiBudgetService.update(newBudget).map(result => {
      oldBudget.name = newBudget.name;

      // update isActive and put into correct bucket
      if (oldBudget.isActive !== newBudget.isActive) {
        oldBudget.isActive = newBudget.isActive;
        this.financeService.budgets = this.financeService.budgets;
      }

      return Observable.of(true);
    });
  }

  delete(id: number): Observable<any> {
    return this.webApiBudgetService.delete(id).map(result => {
      if (this.financeService.budgets) {
        const deletedBudget = this.financeService.budgets.find(
          data => data.id === id
        );
        if (deletedBudget) {
          this.financeService.budgets.splice(
            this.financeService.budgets.indexOf(deletedBudget),
            1
          );
          return Observable.of(true);
        }
        return Observable.throw(false);
      }
      return Observable.throw(false);
    });
  }
}
