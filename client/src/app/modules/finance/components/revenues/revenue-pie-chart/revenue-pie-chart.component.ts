import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ChartService } from 'finance/services/chart.service';

@Component({
  selector: 'app-revenue-pie-chart',
  templateUrl: 'revenue-pie-chart.component.html',
  styleUrls: ['revenue-pie-chart.component.scss']
})
export class RevenuePieChartComponent implements OnInit {
  constructor(public chartService: ChartService) {}

  ngOnInit() {}
}
