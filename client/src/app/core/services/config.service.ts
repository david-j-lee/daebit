import { Inject, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ConfigService {
  apiURI: string;

  // TODO: says DOCUMENT is deprecated, need to research
  // tslint:disable-next-line
  constructor(@Inject(DOCUMENT) private document) {
    if (isDevMode) {
      this.apiURI = 'https://api.daebit.com/api';
    } else {
      this.apiURI = 'http://localhost:5000/api';
    }
  }

  getApiURI() {
    return this.apiURI;
  }
}
