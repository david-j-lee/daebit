import { Component, OnInit } from '@angular/core';

import { ScrollTopService } from 'core/services/scroll-top.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
  constructor(private scrollTopService: ScrollTopService) {}

  ngOnInit() {
    this.scrollTopService.setScrollTop();
  }
}
