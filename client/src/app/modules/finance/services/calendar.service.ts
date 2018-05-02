import { Injectable } from '@angular/core';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';

import { Day } from 'finance/interfaces/daily/day.interface';

import { Moment } from 'moment';
import * as moment from 'moment';

@Injectable()
export class CalendarService {
  days: Day[];

  hasPrev = false;
  hasNext = true;

  currentMonthText = '';
  currentMonth = 0;
  minMonth = 0;
  maxMonth = 0;

  currentYear = 0;
  minYear = 0;
  maxYear = 0;

  constructor(
    private financeService: FinanceService,
    private dailyService: DailyService
  ) {}

  setFirstMonth() {
    if (
      this.financeService.selectedBudget.days &&
      this.financeService.selectedBudget.days.length > 0
    ) {
      const firstDay = this.financeService.selectedBudget.days[0];
      const lastDay = this.financeService.selectedBudget.days[
        this.financeService.selectedBudget.days.length - 1
      ];

      this.minMonth = firstDay.date.month() + 1;
      this.maxMonth = lastDay.date.month() + 1;
      this.currentMonth = this.minMonth;

      this.minYear = firstDay.date.year();
      this.maxYear = lastDay.date.year();
      this.currentYear = this.minYear;

      this.setMonth(this.minYear, this.minMonth);
    }
  }

  setMonth(year: number, month: number) {
    this.currentMonthText = moment(this.currentMonth, 'M').format('MMMM');
    this.days = [];
    const days = this.financeService.selectedBudget.days.filter(
      x => x.year == year && x.month + 1 == month
    );

    if (days) {
      let firstDate = days[0].date.clone().startOf('month');
      if (!firstDate.weekday(0)) {
        firstDate = firstDate.add(-7, 'days').isoWeekday(7);
      }

      const lastDate = days[days.length - 1].date
        .clone()
        .endOf('month')
        .isoWeekday(6);
      const numLoops = lastDate.diff(firstDate, 'days');
      let lastBalance = 0;

      for (let i = 0; i <= numLoops; i++) {
        const day = this.financeService.selectedBudget.days.find(
          x =>
            x.date.format('L') ==
            firstDate
              .clone()
              .add(i, 'days')
              .format('L')
        );

        if (day !== undefined) {
          this.days.push(day);
          lastBalance = day.balance;
        } else {
          const emptyDate: Day = {
            date: firstDate.clone().add(i, 'days'),
            month: firstDate
              .clone()
              .add(i, 'days')
              .month(),
            year: firstDate
              .clone()
              .add(i, 'days')
              .year(),
            dailyBalances: [],
            dailyRevenues: [],
            dailyExpenses: [],
            totalBalance: 0,
            totalRevenue: 0,
            totalExpense: 0,
            balance: lastBalance
          };
          this.days.push(emptyDate);
        }
      }
    }
  }

  next() {
    if (this.hasNext) {
      const newPeriod = this.addMonth(this.currentMonth, this.currentYear);
      this.currentMonth = newPeriod.month;
      this.currentYear = newPeriod.year;

      this.checkNext();
      this.checkPrev();

      this.setMonth(this.currentYear, this.currentMonth);
    }
  }

  prev() {
    if (this.hasPrev) {
      const newPeriod = this.removeMonth(this.currentMonth, this.currentYear);
      this.currentMonth = newPeriod.month;
      this.currentYear = newPeriod.year;

      this.checkNext();
      this.checkPrev();

      this.setMonth(this.currentYear, this.currentMonth);
    }
  }

  private addMonth(month: number, year: number): any {
    if (month === 12) {
      month = 1;
      year++;
    } else {
      month++;
    }
    return { month: month, year: year };
  }

  private removeMonth(month: number, year: number): any {
    if (month === 1) {
      month = 12;
      year--;
    } else {
      month--;
    }
    return { month: month, year: year };
  }

  private checkNext() {
    const nextPeriod = this.addMonth(this.currentMonth, this.currentYear);
    if (nextPeriod.month > this.maxMonth && nextPeriod.year >= this.maxYear) {
      this.hasNext = false;
    } else {
      this.hasNext = true;
    }
  }

  private checkPrev() {
    const prevPeriod = this.removeMonth(this.currentMonth, this.currentYear);
    if (
      prevPeriod.year < this.minYear ||
      (prevPeriod.month < this.minMonth && prevPeriod.year == this.minYear)
    ) {
      this.hasPrev = false;
    } else {
      this.hasPrev = true;
    }
  }
}
