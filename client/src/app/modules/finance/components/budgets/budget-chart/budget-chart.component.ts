import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';
import { ChartService } from 'finance/services/chart.service';

@Component({
  selector: 'app-budget-chart',
  templateUrl: 'budget-chart.component.html',
  styleUrls: ['budget-chart.component.scss']
})
export class BudgetChartComponent implements OnInit {
  constructor(
    public chartService: ChartService,
    private financeService: FinanceService
  ) {}

  ngOnInit() {}
}
