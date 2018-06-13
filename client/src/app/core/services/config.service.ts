import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class ConfigService {
  apiURI: string;

  // TODO: says DOCUMENT is deprecated, need to research
  // tslint:disable-next-line
  constructor() {
    if (isDevMode()) {
      this.apiURI = 'http://localhost:5000/api';
    } else {
      this.apiURI = 'https://api.daebit.com/api';
    }
  }

  getApiURI() {
    return this.apiURI;
  }
}
