/*
    This service handles all the calls to the WebAPI for balances
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from 'core/services/config.service';
import { BaseService } from 'core/services/base.service';
import { AccountService } from 'account/services/account.service';

import { Balance } from 'finance/interfaces/balances/balance.interface';
import { BalanceAdd } from 'finance/interfaces/balances/balance-add.interface';
import { BalanceEdit } from 'finance/interfaces/balances/balance-edit.interface';

@Injectable()
export class WebApiBalanceService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll(budgetId: number) {
    const url = `${this.baseUrl}/balances/getall?budgetId=${budgetId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers }).catch(this.handleError);
  }

  add(value: BalanceAdd) {
    const url = `${this.baseUrl}/balances/add`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers }).catch(this.handleError);
  }

  update(value: BalanceEdit) {
    const url = `${this.baseUrl}/balances/edit`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.put(url, body, { headers }).catch(this.handleError);
  }

  delete(id: number) {
    const url = `${this.baseUrl}/balances/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers }).catch(this.handleError);
  }
}
