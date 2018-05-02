import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from '@angular/material';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { ExpenseService } from 'finance/services/api/expense.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

import { Expense } from 'finance/interfaces/expenses/expense.interface';
import { ExpenseAdd } from 'finance/interfaces/expenses/expense-add.interface';
import { ExpenseEdit } from 'finance/interfaces/expenses/expense-edit.interface';

import { ExpenseDeleteComponent } from 'finance/components/expenses/expense-delete/expense-delete.component';

@Component({
  selector: 'app-expense-edit',
  template: ''
})
export class ExpenseEditComponent implements OnInit {
  matDialogRef: MatDialogRef<ExpenseEditDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(parentParams => {
      this.activatedRoute.params.subscribe(params => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(ExpenseEditDialogComponent, {
            data: { id: params['id'] }
          });
        });
      });
    });
  }
}

@Component({
  selector: 'app-expense-edit-dialog',
  templateUrl: 'expense-edit.component.html',
  styleUrls: ['expense-edit.component.scss']
})
export class ExpenseEditDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  oldExpense: Expense;
  newExpense: ExpenseAdd;

  navigateToDelete = false;
  deleteModal: MatDialogRef<ExpenseDeleteComponent>;

  constructor(
    public financeService: FinanceService,
    private router: Router,
    private userService: AccountService,
    private expenseService: ExpenseService,
    private dailyService: DailyService,
    private chartService: ChartService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ExpenseEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    // Get Balance
    if (this.financeService.selectedBudget.expenses) {
      this.getData();
    } else {
      this.expenseService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe(result => {
          if (result) {
            this.getData();
          }
        });
    }
  }

  setAfterClosed() {
    this.matDialogRef.afterClosed().subscribe((result: string) => {
      this.matDialogRef = null;
      // need to check for navigation with forward button
      const action = this.router.url.split('/')[
        this.router.url.split('/').length - 1
      ];
      if (action !== 'delete') {
        if (!this.navigateToDelete) {
          this.router.navigate([
            '/budget',
            this.financeService.selectedBudget.id
          ]);
        } else {
          this.router.navigate([
            './budget',
            this.financeService.selectedBudget.id,
            'expense',
            this.oldExpense.id,
            'delete'
          ]);
        }
      }
    });
  }

  getData() {
    // Get Balance
    const expense = this.financeService.selectedBudget.expenses.find(
      x => x.id == this.data.id
    );
    this.oldExpense = expense;
    this.newExpense = {
      description: this.oldExpense.description,
      amount: this.oldExpense.amount,
      isForever: this.oldExpense.isForever,
      frequency: this.oldExpense.frequency,
      startDate: this.oldExpense.startDate,
      endDate: this.oldExpense.endDate,
      repeatMon: this.oldExpense.repeatMon,
      repeatTue: this.oldExpense.repeatTue,
      repeatWed: this.oldExpense.repeatWed,
      repeatThu: this.oldExpense.repeatThu,
      repeatFri: this.oldExpense.repeatFri,
      repeatSat: this.oldExpense.repeatSat,
      repeatSun: this.oldExpense.repeatSun,
      budgetId: undefined
    };
  }

  requestDelete() {
    this.navigateToDelete = true;
    this.matDialogRef.close();
  }

  edit({ value, valid }: { value: ExpenseEdit; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    if (valid) {
      value.id = this.oldExpense.id;
      this.expenseService
        .update(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              this.oldExpense.description = this.newExpense.description;
              this.oldExpense.amount = this.newExpense.amount;
              this.oldExpense.isForever = this.newExpense.isForever;
              this.oldExpense.frequency = this.newExpense.frequency;
              this.oldExpense.startDate = this.newExpense.startDate;
              this.oldExpense.endDate = this.newExpense.endDate;
              this.oldExpense.repeatMon = this.newExpense.repeatMon;
              this.oldExpense.repeatTue = this.newExpense.repeatTue;
              this.oldExpense.repeatWed = this.newExpense.repeatWed;
              this.oldExpense.repeatThu = this.newExpense.repeatThu;
              this.oldExpense.repeatFri = this.newExpense.repeatFri;
              this.oldExpense.repeatSat = this.newExpense.repeatSat;
              this.oldExpense.repeatSun = this.newExpense.repeatSun;

              this.matDialogRef.close();
              this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });

              // update all
              this.dailyService.deleteExpense(this.oldExpense);
              this.dailyService.generateExpense(this.oldExpense);
              this.oldExpense.yearlyAmount = this.dailyService.getYearlyAmountExpense(
                this.oldExpense
              );
              this.dailyService.setRunningTotals();
              this.chartService.setChartExpense();
              this.chartService.setChartBudget();
            }
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }
}
