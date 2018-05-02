import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';
import { ChartService } from 'finance/services/chart.service';

@Component({
  selector: 'app-balance-pie-chart',
  templateUrl: 'balance-pie-chart.component.html',
  styleUrls: ['balance-pie-chart.component.scss']
})
export class BalancePieChartComponent implements OnInit {
  constructor(
    public chartService: ChartService,
    private financeService: FinanceService
  ) {}

  ngOnInit() {}
}
