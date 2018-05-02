import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { ExpenseService } from 'finance/services/api/expense.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

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
    private userService: AccountService,
    public financeService: FinanceService,
    private expenseService: ExpenseService,
    private dailyService: DailyService,
    private chartService: ChartService,
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
      value.budgetId = this.financeService.selectedBudget.id;
      this.expenseService
        .add(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              // add new class locally
              const newExpense: Expense = {
                id: result,
                description: value.description,
                amount: value.amount,
                isForever: value.isForever,
                frequency: value.frequency,
                startDate: value.startDate,
                endDate: value.endDate,
                repeatMon: value.repeatMon,
                repeatTue: value.repeatTue,
                repeatWed: value.repeatWed,
                repeatThu: value.repeatThu,
                repeatFri: value.repeatFri,
                repeatSat: value.repeatSat,
                repeatSun: value.repeatSun,
                yearlyAmount: 0,
                dailyExpenses: []
              };

              this.financeService.selectedBudget.expenses.push(newExpense);
              this.matDialogRef.close();
              this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });

              // generate daily data and update charts
              this.dailyService.generateExpense(newExpense);
              newExpense.yearlyAmount = this.dailyService.getYearlyAmountExpense(
                newExpense
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
