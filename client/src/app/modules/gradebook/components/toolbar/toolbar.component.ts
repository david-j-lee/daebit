import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GradebookService } from 'gradebook/services/gradebook.service';
import { DalItemService } from 'gradebook/services/dal/dal.item.service';

import { ClassEditComponent } from 'gradebook/components/class-edit/class-edit.component';
import { ClassAddComponent } from 'gradebook/components/class-add/class-add.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() goalSeek = new EventEmitter<number>();

  goal: number | undefined;

  showArchivedClasses = false;

  constructor(
    public gradebookService: GradebookService,
    public matDialog: MatDialog,
    private dalItemService: DalItemService
  ) {}

  ngOnInit() {}

  onGoalChanged(newValue: number | undefined) {
    if (newValue as number) {
      this.goal = newValue;
      this.dalItemService.goalSeek(this.goal);
    }
  }

  average() {
    this.onGoalChanged(
      Math.floor(this.gradebookService.selectedClass.completedGrade * 1000) / 10
    );
  }
}
