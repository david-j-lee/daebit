import { Inject, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ConfigService {
  apiURI: string;

  // TODO: says DOCUMENT is deprecated, need to research
  // tslint:disable-next-line
  constructor(@Inject(DOCUMENT) private document) {
    console.log(isDevMode);
    if (isDevMode) {
      this.apiURI = 'http://localhost:5000/api';
    } else {
      this.apiURI = 'https://api.daebit.com/api';
    }
  }

  getApiURI() {
    return this.apiURI;
  }
}
