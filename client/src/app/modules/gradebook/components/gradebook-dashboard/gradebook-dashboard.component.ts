import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GradebookService } from 'gradebook/services/gradebook.service';

@Component({
  selector: 'app-gradebook-dashboard',
  templateUrl: './gradebook-dashboard.component.html',
  styleUrls: ['./gradebook-dashboard.component.scss']
})
export class GradebookDashboardComponent implements OnInit {
  classId: number;

  constructor(
    public gradebookService: GradebookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.classId = params.id;
      this.selectClass();
    });
   }

  private selectClass() {
    const selectedClass = this.gradebookService.classes.find(
      x => x.id == this.classId
    );
    this.gradebookService.selectClass(selectedClass);
  }
}
