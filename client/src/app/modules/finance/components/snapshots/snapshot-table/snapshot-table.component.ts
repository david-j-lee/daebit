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

import { FinanceService } from 'finance/services/finance.service';
import { DalSnapshotService } from 'finance/services/dal/dal.snapshot.service';

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
    private financeService: FinanceService,
    private dailyService: DailyService,
    private dalSnapshotService: DalSnapshotService,
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

    // send to db
    this.dalSnapshotService
      .save(this.addSnapshot, this.balances)
      .finally(() => (this.isRequesting = false))
      .subscribe(result => {
        this.matDialogRef.close();
        this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
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
