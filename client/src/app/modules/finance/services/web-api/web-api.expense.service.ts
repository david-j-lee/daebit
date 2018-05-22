/*
    This service handles all the calls to the WebAPI for expenses
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from 'core/services/config.service';
import { BaseService } from 'core/services/base.service';
import { AccountService } from 'account/services/account.service';

import { Expense } from 'finance/interfaces/expenses/expense.interface';
import { ExpenseAdd } from 'finance/interfaces/expenses/expense-add.interface';
import { ExpenseEdit } from 'finance/interfaces/expenses/expense-edit.interface';

@Injectable()
export class WebApiExpenseService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll(budgetId: number) {
    const url = `${this.baseUrl}/expenses/getall?budgetId=${budgetId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers }).catch(this.handleError);
  }

  add(value: ExpenseAdd) {
    const url = this.baseUrl + '/expenses/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers }).catch(this.handleError);
  }

  update(value: ExpenseEdit) {
    const url = this.baseUrl + '/expenses/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.put(url, body, { headers }).catch(this.handleError);
  }

  delete(id: number) {
    const url = `${this.baseUrl}/expenses/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers }).catch(this.handleError);
  }
}
