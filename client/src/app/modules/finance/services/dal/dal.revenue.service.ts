/*
  This data access layer handles all the business logic after an webAPI call
*/

import { Injectable } from '@angular/core';

import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { RevenueAdd } from 'finance/interfaces/revenues/revenue-add.interface';
import { RevenueEdit } from 'finance/interfaces/revenues/revenue-edit.interface';
import { WebApiRevenueService } from 'app/modules/finance/services/web-api/web-api.revenue.service';
import { FinanceService } from 'app/modules/finance/services/finance.service';
import { DailyService } from 'app/modules/finance/services/daily.service';
import { ChartService } from 'app/modules/finance/services/chart.service';

@Injectable()
export class DalRevenueService {
  constructor(
    private webApiRevenueService: WebApiRevenueService,
    private financeService: FinanceService,
    private dailyService: DailyService,
    private chartService: ChartService
  ) {}

  getAll(budgetId: number) {
    return this.webApiRevenueService.getAll(budgetId).map(result => {
      return result;
    });
  }

  add(value: RevenueAdd) {
    value.budgetId = this.financeService.selectedBudget.id;
    return this.webApiRevenueService.add(value).map(result => {
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

      // update daily data and charts
      this.dailyService.generateRevenue(newRevenue);
      newRevenue.yearlyAmount = this.dailyService.getTotalRevenue(newRevenue);
      this.dailyService.setRunningTotals();
      this.chartService.setChartRevenue();
      this.chartService.setChartBudget();
    });
  }

  update(oldRevenue: Revenue, newRevenue: RevenueEdit) {
    newRevenue.id = oldRevenue.id;
    return this.webApiRevenueService.update(newRevenue).map(result => {
      oldRevenue.description = newRevenue.description;
      oldRevenue.amount = newRevenue.amount;
      oldRevenue.isForever = newRevenue.isForever;
      oldRevenue.frequency = newRevenue.frequency;
      oldRevenue.startDate = newRevenue.startDate;
      oldRevenue.endDate = newRevenue.endDate;
      oldRevenue.repeatMon = newRevenue.repeatMon;
      oldRevenue.repeatTue = newRevenue.repeatTue;
      oldRevenue.repeatWed = newRevenue.repeatWed;
      oldRevenue.repeatThu = newRevenue.repeatThu;
      oldRevenue.repeatFri = newRevenue.repeatFri;
      oldRevenue.repeatSat = newRevenue.repeatSat;
      oldRevenue.repeatSun = newRevenue.repeatSun;

      // update daily data and charts
      this.dailyService.deleteRevenue(oldRevenue);
      this.dailyService.generateRevenue(oldRevenue);
      oldRevenue.yearlyAmount = this.dailyService.getTotalRevenue(oldRevenue);
      this.dailyService.setRunningTotals();
      this.chartService.setChartRevenue();
      this.chartService.setChartBudget();
    });
  }

  delete(id: number) {
    return this.webApiRevenueService.delete(id).map(result => {
      if (this.financeService.selectedBudget.expenses) {
        const deletedRevenue = this.financeService.selectedBudget.revenues.find(
          data => data.id === id
        );
        if (deletedRevenue) {
          this.financeService.selectedBudget.revenues.splice(
            this.financeService.selectedBudget.revenues.indexOf(deletedRevenue),
            1
          );

          // update daily data and chart
          this.dailyService.deleteRevenue(deletedRevenue);
          this.dailyService.setRunningTotals();
          this.chartService.setChartRevenue();
          this.chartService.setChartBudget();
        }
      }
    });
  }
}
