import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';

import { Day } from 'finance/interfaces/daily/day.interface';
import { Balance } from 'finance/interfaces/balances/balance.interface';
import { Budget } from 'finance/interfaces/budgets/budget.interface';
import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { Expense } from 'finance/interfaces/expenses/expense.interface';

import { DailyBalance } from 'finance/interfaces/daily/daily-balance.interface';
import { DailyExpense } from 'finance/interfaces/daily/daily-expense.interface';
import { DailyRevenue } from 'finance/interfaces/daily/daily-revenue.interface';

import { Moment } from 'moment';
import * as moment from 'moment';

@Injectable()
export class DailyService {
  todaysEstimatedBalance = 0;
  startDate: Moment;
  endDate: Moment;
  numberOfDays = 365;
  budget: Budget;

  constructor(private financeService: FinanceService) { }

  getTotalRevenue(revenue: Revenue): number {
    if (revenue.dailyRevenues) {
      return revenue.dailyRevenues.reduce((sum, item) => sum + item.amount, 0);
    } else {
      return 0;
    }
  }

  getTotalExpense(expense: Expense): number {
    if (expense.dailyExpenses) {
      return expense.dailyExpenses.reduce((sum, item) => sum + item.amount, 0);
    } else {
      return 0;
    }
  }

  generateDailyBudget() {
    if (
      this.financeService.selectedBudget &&
      this.financeService.selectedBudget.startDate
    ) {
      this.budget = this.financeService.selectedBudget;
      this.startDate = this.financeService.selectedBudget.startDate.clone();
      this.endDate = this.startDate.clone().add(this.numberOfDays, 'days');

      this.generateDays();
      this.generateBalances();
      this.generateRevenues();
      this.generateExpenses();

      this.setRunningTotals();
    }
  }

  setRunningTotals() {
    let lastBalance = 0;
    this.budget.days.forEach(day => {
      day.balance =
        lastBalance + day.totalBalance + day.totalRevenue - day.totalExpense;
      lastBalance = day.balance;
      if (day.date.format('L') == moment().format('L')) {
        this.todaysEstimatedBalance = day.balance;
      }
    });
  }

  generateBalance(balance: Balance) {
    const firstDay = this.budget.days[0];
    const dailyBalance: DailyBalance = {
      day: firstDay,
      balance: balance,
      amount: balance.amount
    };
    firstDay.dailyBalances.push(dailyBalance);
    firstDay.totalBalance += dailyBalance.amount;
  }

  generateRevenue(revenue: Revenue) {
    switch (revenue.frequency) {
      case 'Once':
        this.generateOnceRevenue(revenue);
        break;
      case 'Daily':
        this.generateDailyRevenue(revenue);
        break;
      case 'Weekly':
        this.generateWeeksRevenue(revenue, 1);
        break;
      case 'Bi-Weekly':
        this.generateWeeksRevenue(revenue, 2);
        break;
      case 'Monthly':
        this.generateMonthsRevenue(revenue, 1);
        break;
      case 'Yearly':
        this.generateMonthsRevenue(revenue, 12);
        break;
    }
  }

  generateExpense(expense: Expense) {
    switch (expense.frequency) {
      case 'Once':
        this.generateOnceExpense(expense);
        break;
      case 'Daily':
        this.generateDailyExpense(expense);
        break;
      case 'Weekly':
        this.generateWeeksExpense(expense, 1);
        break;
      case 'Bi-Weekly':
        this.generateWeeksExpense(expense, 2);
        break;
      case 'Monthly':
        this.generateMonthsExpense(expense, 1);
        break;
      case 'Yearly':
        this.generateMonthsExpense(expense, 12);
        break;
    }
  }

  deleteBalance(balance: Balance) {
    this.budget.days.forEach(day => {
      day.dailyBalances = day.dailyBalances.filter(x => x.balance !== balance);
      day.totalBalance = day.dailyBalances.reduce(
        (sum, item) => sum + item.amount,
        0
      );
    });
  }

  deleteRevenue(revenue: Revenue) {
    revenue.dailyRevenues = [];
    this.budget.days.forEach(day => {
      day.dailyRevenues = day.dailyRevenues.filter(x => x.revenue !== revenue);
      day.totalRevenue = day.dailyRevenues.reduce(
        (sum, item) => sum + item.amount,
        0
      );
    });
  }

  deleteExpense(expense: Expense) {
    expense.dailyExpenses = [];
    this.budget.days.forEach(day => {
      day.dailyExpenses = day.dailyExpenses.filter(x => x.expense !== expense);
      day.totalExpense = day.dailyExpenses.reduce(
        (sum, item) => sum + item.amount,
        0
      );
    });
  }

  private generateDays() {
    this.budget.days = [];

    for (let i = 0; i < this.numberOfDays; i++) {
      const date = this.startDate.clone().add(i, 'days');
      const day: Day = {
        date: date,
        month: date.month(),
        year: date.year(),
        dailyBalances: [],
        dailyExpenses: [],
        dailyRevenues: [],
        totalBalance: 0,
        totalRevenue: 0,
        totalExpense: 0,
        balance: 0
      };
      this.budget.days.push(day);
    }
  }

  generateBalances() {
    this.budget.balances.forEach(balance => {
      this.generateBalance(balance);
    });
  }

  private generateRevenues() {
    this.budget.revenues.forEach(revenue => {
      this.generateRevenue(revenue);
    });
  }

  private generateExpenses() {
    this.budget.expenses.forEach(expense => {
      this.generateExpense(expense);
    });
  }

  private generateOnceRevenue(revenue: Revenue) {
    const day = this.financeService.selectedBudget.days.find(
      x => x.date.format('L') === revenue.startDate.format('L')
    );
    if (day) {
      const dailyRevenue: DailyRevenue = {
        day: day,
        revenue: revenue,
        amount: revenue.amount
      };
      day.dailyRevenues.push(dailyRevenue);
      day.totalRevenue += dailyRevenue.amount;
      if (!revenue.dailyRevenues) {
        revenue.dailyRevenues = [];
      }
      revenue.dailyRevenues.push(dailyRevenue);
    }
  }

  private generateOnceExpense(expense: Expense) {
    const day = this.financeService.selectedBudget.days.find(
      x => x.date.format('L') === expense.startDate.format('L')
    );
    if (day) {
      const dailyExpense: DailyExpense = {
        day: day,
        expense: expense,
        amount: expense.amount
      };
      day.dailyExpenses.push(dailyExpense);
      day.totalExpense += dailyExpense.amount;
      if (!expense.dailyExpenses) {
        expense.dailyExpenses = [];
      }
      expense.dailyExpenses.push(dailyExpense);
    }
  }

  private generateDailyRevenue(revenue: Revenue) {
    const minDate = this.getStartDate(
      this.startDate,
      revenue.startDate,
      revenue.frequency,
      revenue.isForever
    );
    const minDay = this.budget.days.find(
      x => x.date.format('L') === minDate.format('L')
    );
    const minDayIndex = this.budget.days.indexOf(minDay);
    const maxDate = this.getEndDate(
      this.endDate,
      revenue.endDate,
      revenue.isForever
    );
    const numLoops = maxDate.diff(minDate, 'days', true);

    for (let i = 0; i < numLoops; i++) {
      const day = this.budget.days[minDayIndex + i];
      if (day) {
        const dailyRevenue: DailyRevenue = {
          day: day,
          revenue: revenue,
          amount: revenue.amount
        };
        day.dailyRevenues.push(dailyRevenue);
        day.totalRevenue += dailyRevenue.amount;
        if (!revenue.dailyRevenues) {
          revenue.dailyRevenues = [];
        }
        revenue.dailyRevenues.push(dailyRevenue);
      }
    }
  }

  private generateDailyExpense(expense: Expense) {
    const minDate = this.getStartDate(
      this.startDate,
      expense.startDate,
      expense.frequency,
      expense.isForever
    );
    const minDay = this.budget.days.find(
      x => x.date.format('L') === minDate.format('L')
    );
    const minDayIndex = this.budget.days.indexOf(minDay);
    const maxDate = this.getEndDate(
      this.endDate,
      expense.endDate,
      expense.isForever
    );
    const numLoops = maxDate.diff(minDate, 'days', true);

    for (let i = 0; i < numLoops; i++) {
      const day = this.budget.days[minDayIndex + i];
      if (day) {
        const dailyExpense: DailyExpense = {
          day: day,
          expense: expense,
          amount: expense.amount
        };
        day.dailyExpenses.push(dailyExpense);
        day.totalExpense += dailyExpense.amount;
        if (!expense.dailyExpenses) {
          expense.dailyExpenses = [];
        }
        expense.dailyExpenses.push(dailyExpense);
      }
    }
  }

  private generateWeeksRevenue(revenue: Revenue, byWeeks: number) {
    const skipDays = byWeeks * 7;
    const repeatDays = this.dailyRepeatDays(revenue);
    const maxDate = this.getEndDate(
      this.endDate,
      revenue.endDate,
      revenue.isForever
    );
    const firstDate = this.getStartDate(
      this.startDate,
      revenue.startDate,
      revenue.frequency,
      revenue.isForever
    );
    const firstDateIndex = this.budget.days.indexOf(
      this.budget.days.find(x => x.date.format('L') === firstDate.format('L'))
    );
    const numLoops = maxDate.diff(firstDate, 'days', true) / skipDays;

    for (let i = 0; i < numLoops; i++) {
      repeatDays.forEach(repeatDay => {
        const day = this.budget.days[firstDateIndex + i * skipDays + repeatDay];
        if (day) {
          const dailyRevenue: DailyRevenue = {
            day: day,
            revenue: revenue,
            amount: revenue.amount
          };
          day.dailyRevenues.push(dailyRevenue);
          day.totalRevenue += dailyRevenue.amount;
          if (!revenue.dailyRevenues) {
            revenue.dailyRevenues = [];
          }
          revenue.dailyRevenues.push(dailyRevenue);
        }
      });
    }
  }

  private generateWeeksExpense(expense: Expense, byWeeks: number) {
    const skipDays = byWeeks * 7;
    const repeatDays = this.dailyRepeatDays(expense);
    const maxDate = this.getEndDate(
      this.endDate,
      expense.endDate,
      expense.isForever
    );
    const firstDate = this.getStartDate(
      this.startDate,
      expense.startDate,
      expense.frequency,
      expense.isForever
    );
    const firstDateIndex = this.budget.days.indexOf(
      this.budget.days.find(x => x.date.format('L') === firstDate.format('L'))
    );
    const numLoops = maxDate.diff(firstDate, 'days', true) / skipDays;

    for (let i = 0; i < numLoops; i++) {
      repeatDays.forEach(repeatDay => {
        const day = this.budget.days[firstDateIndex + i * skipDays + repeatDay];
        if (day) {
          const dailyExpense: DailyExpense = {
            day: day,
            expense: expense,
            amount: expense.amount
          };
          day.dailyExpenses.push(dailyExpense);
          day.totalExpense += dailyExpense.amount;
          if (!expense.dailyExpenses) {
            expense.dailyExpenses = [];
          }
          expense.dailyExpenses.push(dailyExpense);
        }
      });
    }
  }

  private generateMonthsRevenue(revenue: Revenue, numMonths: number) {
    const maxDate = this.getEndDate(
      this.endDate,
      revenue.endDate,
      revenue.isForever
    );
    const firstDate = this.getStartDate(
      this.startDate,
      revenue.startDate,
      revenue.frequency,
      revenue.isForever
    );
    const firstDateIndex = this.budget.days.indexOf(
      this.budget.days.find(x => x.date.format('L') === firstDate.format('L'))
    );
    const numLoops = Math.ceil(maxDate.diff(firstDate, 'M', true)) / numMonths;

    for (let i = 0; i <= numLoops; i++) {
      const date = firstDate.clone().add(i * numMonths, 'M');
      const day = this.budget.days[
        firstDateIndex + date.diff(firstDate, 'days', true)
      ];
      if (day) {
        const dailyRevenue: DailyRevenue = {
          day: day,
          revenue: revenue,
          amount: revenue.amount
        };
        day.dailyRevenues.push(dailyRevenue);
        day.totalRevenue += dailyRevenue.amount;
        if (!revenue.dailyRevenues) {
          revenue.dailyRevenues = [];
        }
        revenue.dailyRevenues.push(dailyRevenue);
      }
    }
  }

  private generateMonthsExpense(expense: Expense, numMonths: number) {
    const maxDate = this.getEndDate(
      this.endDate,
      expense.endDate,
      expense.isForever
    );
    const firstDate = this.getStartDate(
      this.startDate,
      expense.startDate,
      expense.frequency,
      expense.isForever
    );
    const firstDateIndex = this.budget.days.indexOf(
      this.budget.days.find(x => x.date.format('L') === firstDate.format('L'))
    );
    const numLoops = Math.ceil(maxDate.diff(firstDate, 'M', true)) / numMonths;

    for (let i = 0; i <= numLoops; i++) {
      const date = firstDate.clone().add(i * numMonths, 'M');
      const day = this.budget.days[
        firstDateIndex + date.diff(firstDate, 'days', true)
      ];
      if (day) {
        const dailyExpense: DailyExpense = {
          day: day,
          expense: expense,
          amount: expense.amount
        };
        day.dailyExpenses.push(dailyExpense);
        day.totalExpense += dailyExpense.amount;
        if (!expense.dailyExpenses) {
          expense.dailyExpenses = [];
        }
        expense.dailyExpenses.push(dailyExpense);
      }
    }
  }

  private dailyRepeatDays(item: any): number[] {
    const repeatDays: number[] = [];
    if (item.repeatSun) {
      repeatDays.push(0);
    }
    if (item.repeatMon) {
      repeatDays.push(1);
    }
    if (item.repeatTue) {
      repeatDays.push(2);
    }
    if (item.repeatWed) {
      repeatDays.push(3);
    }
    if (item.repeatThu) {
      repeatDays.push(4);
    }
    if (item.repeatFri) {
      repeatDays.push(5);
    }
    if (item.repeatSat) {
      repeatDays.push(6);
    }
    return repeatDays;
  }

  private getStartDate(
    budgetStartDate: Moment,
    itemStartDate: Moment,
    frequency: string,
    isForever: boolean
  ): Moment {
    let date = budgetStartDate.clone();
    if (!isForever && itemStartDate >= budgetStartDate) {
      date = itemStartDate.clone();
    }

    // if weekly get first monday
    if (!isForever && (frequency === 'Weekly' || frequency === 'Bi-Weekly')) {
      date = itemStartDate.clone().isoWeekday(1);
    }

    // if monthly get most recent month
    if (frequency === 'Monthly') {
      if (itemStartDate < budgetStartDate) {
        const monthNeeded = Math.ceil(
          budgetStartDate.diff(itemStartDate, 'months', true)
        );
        date = itemStartDate.clone().add(monthNeeded, 'M');
      } else {
        date = itemStartDate.clone();
      }
    }

    // if yearly get most recent year
    if (frequency === 'Yearly') {
      if (itemStartDate < budgetStartDate) {
        const yearsNeeded = Math.ceil(
          budgetStartDate.diff(itemStartDate, 'years', true)
        );
        date = itemStartDate.clone().add(yearsNeeded, 'year');
      } else {
        date = itemStartDate.clone();
      }
    }

    return date;
  }

  private getEndDate(
    budgetEndDate: Moment,
    itemEndDate: Moment,
    isForever: boolean
  ): Moment {
    let date = budgetEndDate.clone();
    if (!isForever && itemEndDate <= budgetEndDate) {
      date = itemEndDate;
    }
    return date;
  }
}
