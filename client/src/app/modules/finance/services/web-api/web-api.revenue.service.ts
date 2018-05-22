/*
    This service handles all the calls to the WebAPI for revenues
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from 'core/services/config.service';
import { BaseService } from 'core/services/base.service';
import { AccountService } from 'account/services/account.service';

import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { RevenueAdd } from 'finance/interfaces/revenues/revenue-add.interface';
import { RevenueEdit } from 'finance/interfaces/revenues/revenue-edit.interface';

@Injectable()
export class WebApiRevenueService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll(budgetId: number) {
    const url = `${this.baseUrl}/revenues/getall?budgetId=${budgetId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers }).catch(this.handleError);
  }

  add(value: RevenueAdd) {
    const url = this.baseUrl + '/revenues/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers }).catch(this.handleError);
  }

  update(value: RevenueEdit) {
    const url = this.baseUrl + '/revenues/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.put(url, body, { headers }).catch(this.handleError);
  }

  delete(id: number) {
    const url = `${this.baseUrl}/revenues/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers }).catch(this.handleError);
  }
}
