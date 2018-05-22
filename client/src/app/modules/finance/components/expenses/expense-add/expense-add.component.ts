import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';

import { FinanceService } from 'finance/services/finance.service';
import { DalExpenseService } from 'finance/services/dal/dal.expense.service';

import { Expense } from 'finance/interfaces/expenses/expense.interface';
import { ExpenseAdd } from 'finance/interfaces/expenses/expense-add.interface';

@Component({
  selector: 'app-expense-add',
  template: ''
})
export class ExpenseAddComponent implements OnInit {
  matDialogRef: MatDialogRef<ExpenseAddDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(ExpenseAddDialogComponent);
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
  selector: 'app-expense-add-dialog',
  templateUrl: 'expense-add.component.html',
  styleUrls: ['expense-add.component.scss']
})
export class ExpenseAddDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  myExpense: ExpenseAdd;

  constructor(
    public financeService: FinanceService,
    private dalExpenseService: DalExpenseService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ExpenseAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myExpense = {
      budgetId: 0,
      description: '',
      amount: undefined,
      isForever: true,
      frequency: undefined,
      startDate: undefined,
      endDate: undefined,
      repeatMon: false,
      repeatTue: false,
      repeatWed: false,
      repeatThu: false,
      repeatFri: false,
      repeatSat: false,
      repeatSun: false
    };
  }

  create({ value, valid }: { value: ExpenseAdd; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.dalExpenseService
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
