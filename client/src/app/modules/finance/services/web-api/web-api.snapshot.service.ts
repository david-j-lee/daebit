/*
    This service handles all the calls to the WebAPI for snapshots
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from 'core/services/config.service';
import { BaseService } from 'core/services/base.service';
import { AccountService } from 'account/services/account.service';

import { Snapshot } from 'finance/interfaces/snapshots/snapshot.interface';
import { SnapshotAddAll } from 'finance/interfaces/snapshots/snapshot-add-all.interface';
import { BalanceAdd } from 'finance/interfaces/balances/balance-add.interface';

@Injectable()
export class WebApiSnapshotService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll(budgetId: number) {
    const url = `${this.baseUrl}/snapshots/getall?budgetId=${budgetId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers }).catch(this.handleError);
  }

  save(value: SnapshotAddAll) {
    const url = this.baseUrl + '/snapshots/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers }).catch(this.handleError);
  }

  delete(id: number) {
    const url = `${this.baseUrl}/snapshots/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers }).catch(this.handleError);
  }
}
