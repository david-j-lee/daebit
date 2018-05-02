import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { ConfigService } from 'core/services/config.service';
import { AccountService } from 'account/services/account.service';
import { ClassService } from 'gradebook/services/api/class.service';
import { GradebookCalcService } from 'gradebook/services/gradebook-calc.service';

import { Class } from 'gradebook/interfaces/class.interface';
import { ClassAdd } from 'gradebook/interfaces/class-add.interface';
import { ClassEdit } from 'app/modules/gradebook/interfaces/class-edit.interface';
import { Item } from 'gradebook/interfaces/item.interface';
import { ItemAdd } from 'gradebook/interfaces/item-add.interface';
import { ItemEdit } from 'gradebook/interfaces/item-edit.interface';
import { ItemService } from 'gradebook/services/api/item.service';

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
    private router: Router,
    private http: HttpClient,
    private configService: ConfigService,
    private accountService: AccountService,
    private userService: AccountService,
    private gradebookCalcService: GradebookCalcService,
    private classService: ClassService,
    private itemService: ItemService
  ) {}

  selectClass(myClass: Class) {
    if (myClass !== undefined) {
      this.selectedClass = myClass;
      if (this.selectedClass.isItemsLoaded) {
        this.setDataSource(this.selectedClass.items.length === 0);
      } else {
        this.getItems(this.selectedClass.id);
      }
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

  goalSeek(goal: number) {
    const pointsNeeded =
      this.selectedClass.totalPossible * goal / 100 -
      this.selectedClass.completedEarned;
    const pointsRemaining =
      this.selectedClass.totalPossible - this.selectedClass.completedPossible;
    for (let i = 0; i < this.selectedClass.items.length; i++) {
      if (i + 1 !== this.selectedClass.items.length) {
        // do not touch last one as it will cause an add
        const item = this.selectedClass.items[i];
        if (!item.isCompleted) {
          if (this.selectedClass.isWeighted) {
            item.earned =
              item.weight /
              pointsRemaining *
              pointsNeeded /
              item.weight *
              item.possible;
          } else {
            item.earned = item.possible / pointsRemaining * pointsNeeded;
          }
          this.save(item, false);
        }
      }
    }
    this.setDataSource(false);
    this.updateClassStats();
  }

  private getItems(id: number) {
    this.itemService.get(this.selectedClass.id).subscribe(
      result => {
        if (result) {
          // update grade and set to selected classes items
          const rawItems = result;
          for (const item of rawItems) {
            item.dateDue = item.dateDue !== null ? moment(item.dateDue) : '';
            item.grade = this.calculateGrade(item.earned, item.possible);
          }

          // find class and update
          const myClass = this.classes.find(x => x.id == id);
          if (myClass) {
            myClass.items = result;
          }

          myClass.isItemsLoaded = true;
          this.setDataSource(true);
          this.updateClassStats();
        }
      },
      error => {
        this.selectedClass.items = [];
      }
    );
  }

  private save(item: Item, updateClassStats: boolean) {
    if (updateClassStats) {
      this.updateClassStats();
    }

    if (item.id === null || item.id === undefined) {
      // add
      const itemAdd: ItemAdd = {
        classId: this.selectedClass.id,
        isCompleted: item.isCompleted,
        description: item.description,
        dateDue: item.dateDue,
        earned: item.earned,
        possible: item.possible,
        weight: item.weight
      };
      return this.itemService.add(itemAdd).subscribe(result => {
        if (result) {
          item.id = result;
          item.grade = this.calculateGrade(
            item.earned,
            item.possible
          );
          this.setDataSource(true);
          return true;
        }
      });
    } else {
      // update
      const itemEdit: ItemEdit = {
        id: item.id,
        isCompleted: item.isCompleted,
        description: item.description,
        dateDue: item.dateDue,
        earned: item.earned,
        possible: item.possible,
        weight: item.weight
      };
      return this.itemService.update(itemEdit).subscribe(result => {
        if (result) {
          item.grade = this.calculateGrade(
            item.earned,
            item.possible
          );
          return true;
        }
      });
    }
  }
}
