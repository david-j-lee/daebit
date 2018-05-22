import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MatTableDataSource } from '@angular/material';

import { GradebookCalcService } from 'gradebook/services/gradebook-calc.service';

import { Class } from 'gradebook/interfaces/class.interface';
import { ClassAdd } from 'gradebook/interfaces/class-add.interface';
import { ClassEdit } from 'app/modules/gradebook/interfaces/class-edit.interface';
import { Item } from 'gradebook/interfaces/item.interface';
import { ItemAdd } from 'gradebook/interfaces/item-add.interface';
import { ItemEdit } from 'gradebook/interfaces/item-edit.interface';

import * as moment from 'moment';

@Injectable()
export class GradebookService {
  isLoaded = false;
  classes: Class[];
  selectedClass: Class;

  nonWeightedColumns = [
    'isCompleted',
    'description',
    'dateDue',
    'earned',
    'possible',
    'grade',
    'delete'
  ];
  weightedColumns = [
    'isCompleted',
    'description',
    'dateDue',
    'earned',
    'possible',
    'weight',
    'grade',
    'delete'
  ];
  displayedColumns = [];
  dataSource = new MatTableDataSource();

  constructor(
    private injector: Injector,
    private gradebookCalcService: GradebookCalcService
  ) {
  }

  selectClass(myClass: Class) {
    if (myClass) {
      this.selectedClass = myClass;
    }
  }

  setDataSource(emptyRow: boolean) {
    if (emptyRow) {
      this.selectedClass.items.push({} as Item);
    }
    this.dataSource = new MatTableDataSource(this.selectedClass.items);
  }

  updateClassStats() {
    if (this.selectedClass.items) {
      this.selectedClass.completed = this.gradebookCalcService.getCompleted(
        this.selectedClass
      );
      this.selectedClass.remaining = this.gradebookCalcService.getRemaining(
        this.selectedClass
      );
      this.selectedClass.total = this.selectedClass.items.length + 1;

      this.selectedClass.completedEarned = this.gradebookCalcService.getCompletedEarned(
        this.selectedClass
      );
      this.selectedClass.completedPossible = this.gradebookCalcService.getCompletedPossible(
        this.selectedClass
      );
      this.selectedClass.completedGrade = this.gradebookCalcService.getCompletedGrade(
        this.selectedClass
      );
      this.selectedClass.completedGradeText = this.gradebookCalcService.getGradeText(
        this.selectedClass.completedGrade
      );
      this.selectedClass.completedGradeColor = this.gradebookCalcService.getGradeColor(
        this.selectedClass.completedGrade
      );

      this.selectedClass.totalEarned = this.gradebookCalcService.getTotalEarned(
        this.selectedClass
      );
      this.selectedClass.totalPossible = this.gradebookCalcService.getTotalPossible(
        this.selectedClass
      );
      this.selectedClass.totalGrade = this.gradebookCalcService.getTotalGrade(
        this.selectedClass
      );
      this.selectedClass.totalGradeText = this.gradebookCalcService.getGradeText(
        this.selectedClass.totalGrade
      );
      this.selectedClass.totalGradeColor = this.gradebookCalcService.getGradeColor(
        this.selectedClass.totalGrade
      );
    }
  }

  calculateGrade(earned: any, possible: any): number {
    if (!earned || !possible) {
      return 0;
    }
    if (possible === 0) {
      return 0;
    }
    return earned / possible;
  }

  // private getItems(id: number) {
  //   this.dalItemService.get(this.selectedClass.id).subscribe(
  //     result => {

  //     },
  //     error => {
  //       this.selectedClass.items = [];
  //     }
  //   );
  // }
}
