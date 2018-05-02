import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-public-layout',
  templateUrl: 'public-layout.component.html',
  styleUrls: ['public-layout.component.scss']
})
export class PublicLayoutComponent {
  year: string;
  constructor() {
    this.year = moment().format('YYYY');
  }
}
