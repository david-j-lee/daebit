import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import * as moment from 'moment';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { BudgetService } from 'finance/services/api/budget.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';
import { CalendarService } from 'finance/services/calendar.service';

import { Budget } from 'finance/interfaces/budgets/budget.interface';
import { BudgetAdd } from 'finance/interfaces/budgets/budget-add.interface';
import { Snapshot } from 'finance/interfaces/snapshots/snapshot.interface';

@Component({
  selector: 'app-budget-add',
  template: ''
})
export class BudgetAddComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetAddDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        if (this.financeService.selectedBudget) {
          this.router.navigate([
            '/budget',
            this.financeService.selectedBudget.id
          ]);
        } else {
          this.router.navigate(['/budgets']);
        }
      });
    });
  }
}

@Component({
  selector: 'app-budget-add-dialog',
  templateUrl: 'budget-add.component.html',
  styleUrls: ['./budget-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetAddDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  myBudget: BudgetAdd;

  constructor(
    private router: Router,
    private userService: AccountService,
    public financeService: FinanceService,
    private budgetService: BudgetService,
    private dailyService: DailyService,
    private chartService: ChartService,
    private calendarService: CalendarService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BudgetAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myBudget = { name: '', startDate: moment() };
  }

  create({ value, valid }: { value: BudgetAdd; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.budgetService
        .add(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              // add new class locally
              const newBudget: Budget = {
                id: result.budgetId,
                isBalancesLoaded: true,
                isRevenuesLoaded: true,
                isExpensesLoaded: true,
                isSnapshotsLoaded: true,
                name: value.name,
                startDate: value.startDate,
                isActive: true,
                balances: [],
                revenues: [],
                expenses: [],
                snapshots: [],
                days: []
              };
              this.financeService.budgets.push(newBudget);
              this.financeService.selectBudget(newBudget);
              this.dailyService.generateDailyBudget();
              this.chartService.setChartBalance();
              this.chartService.setChartRevenue();
              this.chartService.setChartExpense();
              this.chartService.setChartBudget();
              this.calendarService.setFirstMonth();

              // add new snapshot
              const newSnapshot: Snapshot = {
                id: result.snapshotId,
                date: value.startDate,
                actualBalance: 0,
                estimatedBalance: 0,
                balanceDifference: 0
              };
              this.financeService.selectedBudget.snapshots.push(newSnapshot);

              this.matDialogRef.close();
              this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
            }
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }
}
