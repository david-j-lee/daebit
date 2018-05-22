/*
This service handles all the calls to the WebAPI for snapshots
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WebApiSnapshotService } from 'finance/services/web-api/web-api.snapshot.service';
import { FinanceService } from 'finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

import { Snapshot } from 'finance/interfaces/snapshots/snapshot.interface';
import { SnapshotAdd } from 'finance/interfaces/snapshots/snapshot-add.interface';
import { SnapshotAddAll } from 'finance/interfaces/snapshots/snapshot-add-all.interface';
import { BalanceAdd } from 'finance/interfaces/balances/balance-add.interface';
import { Balance } from 'finance/interfaces/balances/balance.interface';

@Injectable()
export class DalSnapshotService {
  constructor(
    private webApiSnapshotService: WebApiSnapshotService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService
  ) {}

  getAll(budgetId: number) {
    return this.webApiSnapshotService.getAll(budgetId).map(result => {
      return result;
    });
  }

  save(addSnapshot: SnapshotAdd, balances: Array<Balance>) {
    // calculate balances
    const newAddSnapshot = {
      date: addSnapshot.date.format('L'),
      estimatedBalance: this.dailyService.todaysEstimatedBalance,
      actualBalance: balances
        .filter(x => x.id !== undefined)
        .reduce((sum, item) => sum + item.amount, 0)
    };

    // wrap it all up
    const snapshotAddAll: SnapshotAddAll = {
      budgetId: this.financeService.selectedBudget.id,
      snapshot: newAddSnapshot,
      snapshotBalances: balances.filter(x => x.id !== undefined)
    };

    return this.webApiSnapshotService.save(snapshotAddAll).map(result => {
      // add snapshot to local data
      const snapshot: Snapshot = {
        id: result.snapshotId,
        date: addSnapshot.date,
        estimatedBalance: newAddSnapshot.estimatedBalance,
        actualBalance: newAddSnapshot.actualBalance,
        balanceDifference:
          newAddSnapshot.estimatedBalance - newAddSnapshot.actualBalance
      };
      this.financeService.selectedBudget.snapshots.unshift(snapshot);

      // update balances in local data
      let newBalanceIndex = 0;
      const newBalances: Balance[] = [];
      balances.filter(x => x.id !== undefined).forEach(balance => {
        let balanceId = 0;
        if (balance.id === 0) {
          balanceId = result.balanceIds[newBalanceIndex];
          newBalanceIndex++;
        }
        const newBalance: Balance = {
          id: balanceId,
          description: balance.description,
          amount: balance.amount
        };
        newBalances.push(newBalance);
      });
      this.financeService.selectedBudget.balances = newBalances;

      this.dailyService.generateDailyBudget();
      this.chartService.setChartBalance();
      this.chartService.setChartExpense();
      this.chartService.setChartRevenue();
      this.chartService.setChartBudget();

      return Observable.of(true);
    });
  }

  delete(id: number) {}
}
