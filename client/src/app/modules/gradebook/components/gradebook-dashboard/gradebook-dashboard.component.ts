import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GradebookService } from 'gradebook/services/gradebook.service';
import { DalItemService } from 'gradebook/services/dal/dal.item.service';

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
    private activatedRoute: ActivatedRoute,
    private dalItemService: DalItemService
  ) {}

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

    if (this.gradebookService.selectedClass) {
      if (this.gradebookService.selectedClass.isItemsLoaded) {
        this.gradebookService.setDataSource(
          this.gradebookService.selectedClass.items.length === 0
        );
      } else {
        this.dalItemService.getAll(this.gradebookService.selectedClass.id);
      }
    }

    this.gradebookService.selectClass(selectedClass);
  }
}
