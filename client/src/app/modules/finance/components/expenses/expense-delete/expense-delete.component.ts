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

import { ExpenseEdit } from 'finance/interfaces/expenses/expense-edit.interface';
import { Expense } from 'finance/interfaces/expenses/expense.interface';

@Component({
  selector: 'app-budget-add',
  template: ''
})
export class ExpenseDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<ExpenseDeleteDialogComponent>;

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
            ExpenseDeleteDialogComponent,
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
  selector: 'app-expense-delete-dialog',
  templateUrl: 'expense-delete.component.html',
  styleUrls: ['expense-delete.component.scss']
})
export class ExpenseDeleteDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  deleteExpense: Expense;

  constructor(
    private userService: AccountService,
    private financeService: FinanceService,
    private expenseService: ExpenseService,
    private dailyService: DailyService,
    private chartService: ChartService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ExpenseDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget.expenses) {
      this.getData();
    } else {
      this.expenseService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe(result => {
          this.getData();
        });
    }
  }

  getData() {
    // Get Balance
    const expense = this.financeService.selectedBudget.expenses.find(
      x => x.id == this.data.id
    );
    this.deleteExpense = expense;
  }

  delete() {
    this.expenseService.delete(this.deleteExpense.id).subscribe(
      (result: any) => {
        if (result) {
          this.matDialogRef.close();
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });
          if (this.financeService.selectedBudget.expenses) {
            const deletedExpense = this.financeService.selectedBudget.expenses.find(
              data => data.id === this.deleteExpense.id
            );
            if (deletedExpense) {
              this.financeService.selectedBudget.expenses.splice(
                this.financeService.selectedBudget.expenses.indexOf(
                  deletedExpense
                ),
                1
              );

              this.matDialogRef.close();
              this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });

              // delete daily data and update charts
              this.dailyService.deleteExpense(deletedExpense);
              this.dailyService.setRunningTotals();
              this.chartService.setChartExpense();
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
