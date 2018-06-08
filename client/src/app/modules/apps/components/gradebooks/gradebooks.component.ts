import { Component, OnInit } from '@angular/core';

import { ScrollTopService } from 'core/services/scroll-top.service';

@Component({
  selector: 'app-gradebooks',
  templateUrl: './gradebooks.component.html',
  styleUrls: ['./gradebooks.component.scss']
})
export class GradebooksComponent implements OnInit {
  constructor(private scrollTopService: ScrollTopService) { }

  ngOnInit() {
    this.scrollTopService.setScrollTop();
  }
}
