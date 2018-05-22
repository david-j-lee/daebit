import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';

import { FinanceService } from 'finance/services/finance.service';
import { DalBalanceService } from 'finance/services/dal/dal.balance.service';

import { Balance } from 'finance/interfaces/balances/balance.interface';
import { BalanceAdd } from 'finance/interfaces/balances/balance-add.interface';

@Component({
  selector: 'app-balance-add',
  template: ''
})
export class BalanceAddComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceAddDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BalanceAddDialogComponent);
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
  selector: 'app-balance-add-dialog',
  templateUrl: 'balance-add.component.html',
  styleUrls: ['balance-add.component.scss']
})
export class BalanceAddDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  myBalance: BalanceAdd;

  constructor(
    public financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myBalance = {
      budgetId: undefined,
      description: '',
      amount: undefined
    };
  }

  create({ value, valid }: { value: BalanceAdd; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      value.budgetId = this.financeService.selectedBudget.id;
      this.dalBalanceService
        .add(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            this.matDialogRef.close();
            this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }
}
