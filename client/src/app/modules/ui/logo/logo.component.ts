import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() hexColor: string;
  @Input() svgWidth: string;
  @Input() svgHeight: string;

  constructor() {}

  ngOnInit() {
    if (!this.hexColor) {
      this.hexColor = '#000000';
    } else {
      this.hexColor = '#' + this.hexColor;
    }
  }
}
