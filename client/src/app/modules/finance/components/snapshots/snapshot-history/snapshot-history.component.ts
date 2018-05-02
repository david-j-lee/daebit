import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { FinanceService } from 'finance/services/finance.service';

@Component({
  selector: 'app-snapshot-history',
  template: ''
})
export class SnapshotHistoryComponent implements OnInit {
  matDialogRef: MatDialogRef<SnapshotHistoryDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(SnapshotHistoryDialogComponent);
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
  selector: 'app-snapshot-history-dialog',
  templateUrl: 'snapshot-history.component.html',
  styleUrls: ['snapshot-history.component.scss']
})
export class SnapshotHistoryDialogComponent implements OnInit {
  displayColumns = [
    'date',
    'estimatedBalance',
    'actualBalance',
    'balanceDifference'
  ];
  dataSource = new MatTableDataSource();

  constructor(
    public financeService: FinanceService,
    public matDialogRef: MatDialogRef<SnapshotHistoryDialogComponent>
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(
      this.financeService.selectedBudget.snapshots
    );
  }
}
