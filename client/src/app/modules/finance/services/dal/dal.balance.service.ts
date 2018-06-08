/*
This service handles all the calls to the WebAPI for balances
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WebApiBalanceService } from 'finance/services/web-api/web-api.balance.service';
import { FinanceService } from 'finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

import { Balance } from 'finance/interfaces/balances/balance.interface';
import { BalanceAdd } from 'finance/interfaces/balances/balance-add.interface';
import { BalanceEdit } from 'finance/interfaces/balances/balance-edit.interface';

@Injectable()
export class DalBalanceService {
  constructor(
    private webApiBalanceService: WebApiBalanceService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService
  ) {}

  getAll(budgetId: number): Observable<any> {
    return this.webApiBalanceService.getAll(budgetId).map(result => {
      return result;
    });
  }

  add(value: BalanceAdd): Observable<any> {
    return this.webApiBalanceService.add(value).map(result => {
      // add new class locally
      const newBalance: Balance = {
        id: result,
        description: value.description,
        amount: value.amount
      };

      this.financeService.selectedBudget.balances.push(newBalance);

      // generate daily data and update charts
      this.dailyService.generateBalance(newBalance);
      this.chartService.setChartBalance();
      this.chartService.setChartBudget();

      return Observable.of(true);
    });
  }

  update(oldBalance: Balance, newBalance: BalanceEdit): Observable<any> {
    newBalance.id = oldBalance.id;
    return this.webApiBalanceService.update(newBalance).map(result => {
      oldBalance.description = newBalance.description;
      oldBalance.amount = newBalance.amount;

      // update all
      this.dailyService.deleteBalance(oldBalance);
      this.dailyService.generateBalance(oldBalance);
      this.dailyService.setRunningTotals();
      this.chartService.setChartBalance();
      this.chartService.setChartBudget();

      return Observable.of(true);
    });
  }

  delete(id: number): Observable<any> {
    return this.webApiBalanceService.delete(id).map(result => {
      if (this.financeService.selectedBudget.balances) {
        const deletedBalance = this.financeService.selectedBudget.balances.find(
          data => data.id === id
        );
        if (deletedBalance) {
          this.financeService.selectedBudget.balances.splice(
            this.financeService.selectedBudget.balances.indexOf(deletedBalance),
            1
          );

          // remove daily data and update charts
          this.dailyService.deleteBalance(deletedBalance);
          this.dailyService.setRunningTotals();
          this.chartService.setChartBalance();
          this.chartService.setChartBudget();

          return Observable.of(true);
        }
        return Observable.throw(false);
      }
      return Observable.throw(false);
    });
  }
}
