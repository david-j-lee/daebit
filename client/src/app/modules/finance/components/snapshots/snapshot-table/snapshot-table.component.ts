import { DailyService } from 'finance/services/daily.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatTableDataSource,
  MatDialogRef,
  MatSnackBar,
  MatDialog
} from '@angular/material';
import * as moment from 'moment';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { SnapshotService } from 'finance/services/api/snapshot.service';
import { ChartService } from 'finance/services/chart.service';

import { Snapshot } from 'finance/interfaces/snapshots/snapshot.interface';
import { SnapshotAdd } from 'finance/interfaces/snapshots/snapshot-add.interface';
import { SnapshotAddAll } from 'finance/interfaces/snapshots/snapshot-add-all.interface';
import { SnapshotBalanceAdd } from 'app/modules/finance/interfaces/snapshots/snapshot-balance-add.interface';

import { Balance } from 'finance/interfaces/balances/balance.interface';
import { BalanceAdd } from 'finance/interfaces/balances/balance-add.interface';

@Component({
  selector: 'app-snapshot-table',
  template: ''
})
export class SnapshotTableComponent implements OnInit {
  matDialogRef: MatDialogRef<SnapshotTableDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(SnapshotTableDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        this.router.navigate([
          '/budget',
          this.financeService.selectedBudget.id
        ]);
      });
    });
  }
}

@Component({
  selector: 'app-snapshot-table-dialog',
  templateUrl: 'snapshot-table.component.html',
  styleUrls: ['snapshot-table.component.scss']
})
export class SnapshotTableDialogComponent implements OnInit {
  displayColumns = ['description', 'amount', 'delete'];
  dataSource = new MatTableDataSource();
  addSnapshot: SnapshotAdd;
  balances: SnapshotBalanceAdd[] = [];
  isRequesting: boolean;

  constructor(
    private userService: AccountService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService,
    private snapshotService: SnapshotService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<SnapshotTableDialogComponent>
  ) {}

  ngOnInit() {
    this.addSnapshot = {
      date: moment(),
      estimatedBalance: 0,
      actualBalance: 0
    };

    // create models to add balances to db
    if (this.financeService.selectedBudget.balances) {
      this.financeService.selectedBudget.balances.forEach(balance => {
        const balanceAdd: SnapshotBalanceAdd = {
          id: balance.id,
          description: balance.description,
          amount: balance.amount
        };
        this.balances.push(balanceAdd);
      });
    }

    this.balances.push({} as SnapshotBalanceAdd);

    this.dataSource = new MatTableDataSource(this.balances);
  }

  update() {
    this.isRequesting = true;

    // calculate balances
    const newAddSnapshot = {
      date: this.addSnapshot.date.format('L'),
      estimatedBalance: this.dailyService.todaysEstimatedBalance,
      actualBalance: this.balances
        .filter(x => x.id !== undefined)
        .reduce((sum, item) => sum + item.amount, 0)
    };

    // wrap it all up
    const snapshotAddAll: SnapshotAddAll = {
      budgetId: this.financeService.selectedBudget.id,
      snapshot: newAddSnapshot,
      snapshotBalances: this.balances.filter(x => x.id !== undefined)
    };

    // send to db
    this.snapshotService
      .save(snapshotAddAll)
      .finally(() => (this.isRequesting = false))
      .subscribe(result => {
        if (result) {
          // add snapshot to local data
          const snapshot: Snapshot = {
            id: result.snapshotId,
            date: this.addSnapshot.date,
            estimatedBalance: newAddSnapshot.estimatedBalance,
            actualBalance: newAddSnapshot.actualBalance,
            balanceDifference:
              newAddSnapshot.estimatedBalance - newAddSnapshot.actualBalance
          };
          this.financeService.selectedBudget.snapshots.unshift(snapshot);

          // update balances in local data
          let newBalanceIndex = 0;
          const balances: Balance[] = [];
          this.balances.filter(x => x.id !== undefined).forEach(balance => {
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
            balances.push(newBalance);
          });
          this.financeService.selectedBudget.balances = balances;

          this.matDialogRef.close();
          this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });

          this.dailyService.generateDailyBudget();
          this.chartService.setChartBalance();
          this.chartService.setChartExpense();
          this.chartService.setChartRevenue();
          this.chartService.setChartBudget();
        }
      });
  }

  private save(balance: SnapshotBalanceAdd) {
    if (balance.id === undefined) {
      balance.id = 0;
      this.balances.push({} as SnapshotBalanceAdd);
      this.dataSource = new MatTableDataSource(this.balances);
    }
  }

  private delete(id: number) {
    if (id !== undefined) {
      // delete from items
      const balance = this.balances.find(x => x.id == id);
      this.balances = this.balances.filter(x => x !== balance);
      this.dataSource = new MatTableDataSource(this.balances);
    }
  }
}
