import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';

import { DalBudgetService } from 'finance/services/dal/dal.budget.service';
import { DalBalanceService } from 'finance/services/dal/dal.balance.service';
import { DalExpenseService } from 'finance/services/dal/dal.expense.service';
import { DalRevenueService } from 'finance/services/dal/dal.revenue.service';
import { DalSnapshotService } from 'finance/services/dal/dal.snapshot.service';

import { FinanceService } from 'app/modules/finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';

import { ChartService } from 'finance/services/chart.service';
import { SideBarService } from 'finance/services/side-bar.service';
import { CalendarService } from 'finance/services/calendar.service';

import { Budget } from 'finance/interfaces/budgets/budget.interface';

@Component({
  selector: 'app-budget-dashboard',
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss']
})
export class BudgetDashboardComponent implements OnInit {
  budgetId: number;
  type: string;

  constructor(
    public financeService: FinanceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dailyService: DailyService,
    private dalBudgetService: DalBudgetService,
    private dalBalanceService: DalBalanceService,
    private dalExpenseService: DalExpenseService,
    private dalRevenueService: DalRevenueService,
    private dalSnapshotService: DalSnapshotService,
    private chartService: ChartService,
    private sideBarService: SideBarService,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.budgetId = params['budgetId'] as number;
      if (this.router.url.split('/').length - 1 > 3) {
        this.type = this.router.url.split('/')[3];
      }
      this.selectBudget();
    });
  }

  private selectBudget() {
    const selectedBudget = this.financeService.budgets.find(
      x => x.id == this.budgetId
    );
    if (selectedBudget) {
      this.financeService.selectBudget(selectedBudget);
      this.dailyService.generateDailyBudget();
      this.chartService.setChartBalance();
      this.chartService.setChartRevenue();
      this.chartService.setChartExpense();
      this.chartService.setChartBudget();
      this.calendarService.setFirstMonth();

      if (!selectedBudget.isBalancesLoaded) {
        this.sideBarService.setExpanded(this.type);
        this.getBalances(selectedBudget);
      }
      if (!selectedBudget.isExpensesLoaded) {
        this.sideBarService.setExpanded(this.type);
        this.getExpenses(selectedBudget);
      }
      if (!selectedBudget.isRevenuesLoaded) {
        this.sideBarService.setExpanded(this.type);
        this.getRevenues(selectedBudget);
      }
      if (!selectedBudget.isSnapshotsLoaded) {
        this.getSnapshots(selectedBudget);
      }
    }
  }

  private getBalances(budget: Budget) {
    this.dalBalanceService.getAll(budget.id).subscribe(
      result => {
        if (result) {
          budget.balances = result;
          budget.isBalancesLoaded = true;
          this.checkData(budget);
        }
      },
      error => {
        budget.balances = [];
      }
    );
  }

  private getExpenses(budget: Budget) {
    this.dalExpenseService.getAll(budget.id).subscribe(
      result => {
        if (result) {
          const rawItems = result;
          for (const item of rawItems) {
            item.startDate =
              item.startDate !== null ? moment(item.startDate) : '';
            item.endDate = item.endDate !== null ? moment(item.endDate) : '';
          }
          budget.expenses = result;
          budget.isExpensesLoaded = true;
          this.checkData(budget);
        }
      },
      error => {
        budget.expenses = [];
      }
    );
  }

  private getRevenues(budget: Budget) {
    this.dalRevenueService.getAll(budget.id).subscribe(
      result => {
        if (result) {
          const rawItems = result;
          for (const item of rawItems) {
            item.startDate =
              item.startDate !== null ? moment(item.startDate) : '';
            item.endDate = item.endDate !== null ? moment(item.endDate) : '';
          }
          budget.revenues = result;
          budget.isRevenuesLoaded = true;
          this.checkData(budget);
        }
      },
      error => {
        budget.revenues = [];
      }
    );
  }

  private getSnapshots(budget: Budget) {
    this.dalSnapshotService.getAll(budget.id).subscribe(
      result => {
        if (result) {
          const rawItems = result;
          for (const item of rawItems) {
            item.date = item.date !== null ? moment(item.date) : '';
            item.balanceDifference = item.estimatedBalance - item.actualBalance;
          }
          budget.snapshots = result;
          budget.startDate = budget.snapshots[0].date;
          budget.isSnapshotsLoaded = true;
          this.checkData(budget);
        }
      },
      error => {
        budget.revenues = [];
      }
    );
  }

  private checkData(budget: Budget) {
    if (
      budget.isBalancesLoaded &&
      budget.isExpensesLoaded &&
      budget.isRevenuesLoaded &&
      budget.isSnapshotsLoaded
    ) {
      this.dailyService.generateDailyBudget();
      this.chartService.setChartBalance();
      this.chartService.setChartExpense();
      this.chartService.setChartRevenue();
      this.chartService.setChartBudget();
      this.calendarService.setFirstMonth();
    }
  }
}
