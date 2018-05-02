import { Component, OnInit } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';
import { DailyService } from 'finance/services/daily.service';
import { CalendarService } from 'finance/services/calendar.service';

import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  today: Moment;

  constructor(
    public calendarService: CalendarService,
    private financeService: FinanceService,
    private dailyService: DailyService
  ) {}

  ngOnInit() {
    this.today = moment();
  }
}
