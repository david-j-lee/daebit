import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { ConfigService } from 'core/services/config.service';
import { BaseService } from 'core/services/base.service';
import { AccountService } from 'app/modules/account/services/account.service';

import { ItemAdd } from 'gradebook/interfaces/item-add.interface';
import { ItemEdit } from 'gradebook/interfaces/item-edit.interface';

@Injectable()
export class WebApiItemService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll(classId: number): Observable<any> {
    const url = `${this.baseUrl}/items/getall?classId=${classId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers }).catch(this.handleError);
  }

  add(value: ItemAdd): Observable<any> {
    const url = this.baseUrl + '/items/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers }).catch(this.handleError);
  }

  update(value: ItemEdit): Observable<any> {
    const url = this.baseUrl + '/items/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers }).catch(this.handleError);
  }

  delete(id: number): Observable<any> {
    const url = `${this.baseUrl}/items/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers }).catch(this.handleError);
  }
}
