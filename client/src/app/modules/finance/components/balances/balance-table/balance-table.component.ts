import { Component, OnInit } from '@angular/core';

import { FinanceService } from 'finance/services/finance.service';

import { Balance } from 'finance/interfaces/balances/balance.interface';

import { BalanceEditComponent } from 'finance/components/balances/balance-edit/balance-edit.component';

@Component({
  selector: 'app-balance-table',
  templateUrl: 'balance-table.component.html',
  styleUrls: ['balance-table.component.scss']
})
export class BalanceTableComponent implements OnInit {
  constructor(
    public financeService: FinanceService
  ) {}

  ngOnInit() {}
}
