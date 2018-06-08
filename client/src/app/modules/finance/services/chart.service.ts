import { Injectable } from '@angular/core';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';

import { Budget } from 'finance/interfaces/budgets/budget.interface';

import { ChartBalance } from 'finance/interfaces/charts/chart-balance.interface';
import { ChartRevenue } from 'finance/interfaces/charts/chart-revenue.interface';
import { ChartExpense } from 'finance/interfaces/charts/chart-expense.interface';
import { ChartBudget } from 'finance/interfaces/charts/chart-budget.interface';

import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { Expense } from 'finance/interfaces/expenses/expense.interface';

@Injectable()
export class ChartService {
  pieOptions = {
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false }
  };

  balanceColorLightest = 'rgba(54, 162, 235, 0.2)';
  balanceColorLight = 'rgba(54, 162, 235, 0.8)';
  balanceColorNormal = 'rgba(54, 162, 235, 1)';
  chartBalance: ChartBalance = {
    chartType: 'doughnut',
    options: this.pieOptions,
    colors: this.generateSingleColors(
      1,
      this.balanceColorLightest,
      this.balanceColorNormal
    ),
    labels: [''],
    data: [0],
    total: 0
  };

  revenueColorLightest = 'rgba(75, 192, 192, 0.2)';
  revenueColorLight = 'rgba(75, 192, 192, 0.8)';
  revenueColorNormal = 'rgba(75, 192, 192, 1)';
  chartRevenue: ChartRevenue = {
    chartType: 'doughnut',
    options: this.pieOptions,
    colors: this.generateSingleColors(
      1,
      this.revenueColorLightest,
      this.revenueColorNormal
    ),
    labels: [''],
    data: [0],
    total: 0
  };

  expenseColorLightest = 'rgba(255, 99, 132, 0.2)';
  expenseColorLight = 'rgba(255, 99, 132, 0.8)';
  expenseColorNormal = 'rgba(255, 99, 132, 1)';
  chartExpense: ChartExpense = {
    chartType: 'doughnut',
    options: this.pieOptions,
    colors: this.generateSingleColors(
      1,
      this.expenseColorLightest,
      this.expenseColorNormal
    ),
    labels: [''],
    data: [0],
    total: 0
  };

  lineOptions = {
    animation: { duration: 0 },
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: true, position: 'top' },
    tooltips: { mode: 'index', intersect: false },
    elements: { point: { radius: 0 } }
  };

  lineChartColors: Array<any> = [
    {
      // Balances
      backgroundColor: this.balanceColorLightest,
      borderColor: this.balanceColorNormal,
      pointBackgroundColor: this.balanceColorNormal,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.balanceColorLight
    },
    {
      // Revenues
      backgroundColor: this.revenueColorLightest,
      borderColor: this.revenueColorNormal,
      pointBackgroundColor: this.revenueColorNormal,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.revenueColorLight
    },
    {
      // Expenses
      backgroundColor: this.expenseColorLightest,
      borderColor: this.expenseColorNormal,
      pointBackgroundColor: this.expenseColorNormal,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.expenseColorLight
    }
  ];
  chartBudget: ChartBudget;

  constructor(
    private financeService: FinanceService,
    private dailyService: DailyService
  ) {}

  // https://github.com/valor-software/ng2-charts/issues/774
  // Chart.js has a bug in which the chart will not update new labels
  // unless they are modified with the original array reference.

  setChartBalance() {
    if (this.financeService.selectedBudget.balances) {
      const labels: string[] = [];
      const data: number[] = [];
      let total = 0;
      this.financeService.selectedBudget.balances.forEach(balance => {
        labels.push(balance.description);
        data.push(balance.amount);
        total += balance.amount;
      });

      this.chartBalance.colors = this.generateSingleColors(
        data.length,
        this.balanceColorLightest,
        this.balanceColorNormal
      );
      this.chartBalance.total = total;

      this.chartBalance.data.length = 0;
      data.forEach(record => {
        this.chartBalance.data.push(record);
      });

      this.chartBalance.labels.length = 0;
      labels.forEach(label => {
        this.chartBalance.labels.push(label);
      });
    }
  }

  setChartRevenue() {
    if (this.financeService.selectedBudget.revenues) {
      const labels: string[] = [];
      const data: number[] = [];
      let total = 0;
      this.financeService.selectedBudget.revenues.forEach(revenue => {
        revenue.yearlyAmount = this.dailyService.getYearlyAmountRevenue(
          revenue
        );
        labels.push(revenue.description);
        data.push(revenue.yearlyAmount);
        total += revenue.yearlyAmount;
      });

      this.chartRevenue.colors = this.generateSingleColors(
        data.length,
        this.revenueColorLightest,
        this.revenueColorNormal
      );
      this.chartRevenue.total = total;

      this.chartRevenue.data.length = 0;
      data.forEach(record => {
        this.chartRevenue.data.push(record);
      });

      this.chartRevenue.labels.length = 0;
      labels.forEach(label => {
        this.chartRevenue.labels.push(label);
      });
    }
  }

  setChartExpense() {
    if (this.financeService.selectedBudget.expenses) {
      const labels: string[] = [];
      const data: number[] = [];
      let total = 0;
      this.financeService.selectedBudget.expenses.forEach(expense => {
        expense.yearlyAmount = this.dailyService.getYearlyAmountExpense(
          expense
        );
        labels.push(expense.description);
        data.push(expense.yearlyAmount);
        total += expense.yearlyAmount;
      });

      this.chartExpense.colors = this.generateSingleColors(
        data.length,
        this.expenseColorLightest,
        this.expenseColorNormal
      );
      this.chartExpense.total = total;

      this.chartExpense.data.length = 0;
      data.forEach(record => {
        this.chartExpense.data.push(record);
      });

      this.chartExpense.labels.length = 0;
      labels.forEach(label => {
        this.chartExpense.labels.push(label);
      });
    }
  }

  setChartBudget() {
    if (this.financeService.selectedBudget.days) {
      const labels = [];
      const datasets = [
        { data: [], label: 'Balances' },
        { data: [], label: 'Revenues' },
        { data: [], label: 'Expenses' }
      ];

      this.financeService.selectedBudget.days.forEach(day => {
        labels.push(day.date.format('M/D'));
        datasets[0].data.push(day.balance);
        datasets[1].data.push(day.totalRevenue);
        datasets[2].data.push(-day.totalExpense);
      });

      this.chartBudget = {
        chartType: 'line',
        options: this.lineOptions,
        colors: this.lineChartColors,
        labels: labels,
        datasets: datasets
      };
    }
  }

  private generateSingleColors(
    number: number,
    bgColor: string,
    borderColor: string
  ) {
    const bgColors: string[] = [];
    const borderColors: string[] = [];
    for (let i = 0; i <= number; i++) {
      bgColors.push(bgColor);
      borderColors.push(borderColor);
    }
    return [{ backgroundColor: bgColor, borderColor: borderColor }];
  }
}
