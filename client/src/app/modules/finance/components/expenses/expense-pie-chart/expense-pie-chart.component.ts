import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ChartService } from 'finance/services/chart.service';

@Component({
  selector: 'app-expense-pie-chart',
  templateUrl: 'expense-pie-chart.component.html',
  styleUrls: ['expense-pie-chart.component.scss']
})
export class ExpensePieChartComponent implements OnInit {
  constructor(public chartService: ChartService) {}

  ngOnInit() {}
}
