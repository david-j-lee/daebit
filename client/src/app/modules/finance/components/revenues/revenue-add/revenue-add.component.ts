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
import { RevenueService } from 'finance/services/api/revenue.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { RevenueAdd } from 'finance/interfaces/revenues/revenue-add.interface';

@Component({
  selector: 'app-revenue-add',
  template: ''
})
export class RevenueAddComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueAddDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(RevenueAddDialogComponent);
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
  selector: 'app-revenue-add-dialog',
  templateUrl: 'revenue-add.component.html',
  styleUrls: ['revenue-add.component.scss']
})
export class RevenueAddDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  myRevenue: RevenueAdd;

  constructor(
    private userService: AccountService,
    public financeService: FinanceService,
    private revenueService: RevenueService,
    private dailyService: DailyService,
    private chartService: ChartService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myRevenue = {
      budgetId: undefined,
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

  create({ value, valid }: { value: RevenueAdd; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      value.budgetId = this.financeService.selectedBudget.id;
      this.revenueService
        .add(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              // add new class locally
              const newRevenue: Revenue = {
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
                dailyRevenues: []
              };

              this.financeService.selectedBudget.revenues.push(newRevenue);
              this.matDialogRef.close();
              this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });

              // update daily data and charts
              this.dailyService.generateRevenue(newRevenue);
              newRevenue.yearlyAmount = this.dailyService.getYearlyAmountRevenue(
                newRevenue
              );
              this.dailyService.setRunningTotals();
              this.chartService.setChartRevenue();
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
