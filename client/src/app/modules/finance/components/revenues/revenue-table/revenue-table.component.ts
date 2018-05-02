import { Component, OnInit } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';

import { RevenueEditComponent } from 'finance/components/revenues/revenue-edit/revenue-edit.component';

@Component({
  selector: 'app-revenue-table',
  templateUrl: 'revenue-table.component.html',
  styleUrls: ['revenue-table.component.scss']
})
export class RevenueTableComponent implements OnInit {
  constructor(public financeService: FinanceService) {}

  ngOnInit() {}
}
