import { Component, OnInit } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';
import { SideBarService } from 'finance/services/side-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(
    public financeService: FinanceService,
    public dailyService: DailyService,
    public sideBarService: SideBarService
  ) {}

  ngOnInit() {}
}
