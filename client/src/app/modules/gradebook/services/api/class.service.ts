import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { ConfigService } from 'core/services/config.service';
import { BaseService } from 'core/services/base.service';
import { AccountService } from 'app/modules/account/services/account.service';

import { Class } from 'gradebook/interfaces/class.interface';
import { ClassAdd } from 'gradebook/interfaces/class-add.interface';
import { ClassEdit } from 'app/modules/gradebook/interfaces/class-edit.interface';

@Injectable()
export class ClassService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll() {
    const url = `${this.baseUrl}/classes/getall`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers }).catch(this.handleError);
  }

  add(value: ClassAdd) {
    const url = this.baseUrl + '/classes/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers }).catch(this.handleError);
  }

  update(value: ClassEdit) {
    const url = this.baseUrl + '/classes/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.put(url, body, { headers }).catch(this.handleError);
  }

  delete(id: number) {
    const url = `${this.baseUrl}/classes/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers }).catch(this.handleError);
  }
}
