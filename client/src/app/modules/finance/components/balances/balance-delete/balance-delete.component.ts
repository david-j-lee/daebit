import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from '@angular/material';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { BalanceService } from 'finance/services/api/balance.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

import { BalanceEdit } from 'finance/interfaces/balances/balance-edit.interface';
import { Balance } from 'finance/interfaces/balances/balance.interface';

@Component({
  selector: 'app-balance-delete',
  template: ''
})
export class BalanceDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceDeleteDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(parentParams => {
      this.activatedRoute.params.subscribe(params => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(
            BalanceDeleteDialogComponent,
            { data: { id: params.id } }
          );
          this.matDialogRef.afterClosed().subscribe((result: string) => {
            this.matDialogRef = null;
            // need to check action for navigation with back button
            const action = this.router.url.split('/')[
              this.router.url.split('/').length - 1
            ];
            if (action !== 'edit') {
              this.router.navigate(['/budget', parentParams.budgetId]);
            }
          });
        });
      });
    });
  }
}

@Component({
  selector: 'app-balance-delete-dialog',
  templateUrl: 'balance-delete.component.html',
  styleUrls: ['balance-delete.component.scss']
})
export class BalanceDeleteDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  deleteBalance: Balance;

  constructor(
    private userService: AccountService,
    private financeService: FinanceService,
    private balanceService: BalanceService,
    private dailyService: DailyService,
    private chartService: ChartService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget.balances) {
      this.getData();
    } else {
      this.balanceService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe(result => {
          if (result) {
            this.getData();
          }
        });
    }
  }

  getData() {
    const balance = this.financeService.selectedBudget.balances.find(
      x => x.id == this.data.id
    );
    this.deleteBalance = balance;
  }

  delete() {
    this.balanceService.delete(this.deleteBalance.id).subscribe(
      (result: any) => {
        if (result) {
          this.matDialogRef.close();
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });
          if (this.financeService.selectedBudget.balances) {
            const deletedBalance = this.financeService.selectedBudget.balances.find(
              data => data.id === this.deleteBalance.id
            );
            if (deletedBalance) {
              this.financeService.selectedBudget.balances.splice(
                this.financeService.selectedBudget.balances.indexOf(
                  deletedBalance
                ),
                1
              );

              this.matDialogRef.close();
              this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });

              // remove daily data and update charts
              this.dailyService.deleteBalance(deletedBalance);
              this.dailyService.setRunningTotals();
              this.chartService.setChartBalance();
              this.chartService.setChartBudget();
            }
          }
        }
      },
      (errors: any) => {
        this.errors = errors;
      }
    );
  }
}
