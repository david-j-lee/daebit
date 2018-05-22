import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WebApiItemService } from 'gradebook/services/web-api/web-api.item.service';
import { GradebookService } from 'gradebook/services/gradebook.service';

import { Item } from 'gradebook/interfaces/item.interface';
import { ItemAdd } from 'gradebook/interfaces/item-add.interface';
import { ItemEdit } from 'gradebook/interfaces/item-edit.interface';

import * as moment from 'moment';

@Injectable()
export class DalItemService {
  private baseUrl = '';

  constructor(
    private webApiItemService: WebApiItemService,
    private gradebookService: GradebookService
  ) {}

  goalSeek(goal: number) {
    const pointsNeeded =
      this.gradebookService.selectedClass.totalPossible * goal / 100 -
      this.gradebookService.selectedClass.completedEarned;
    const pointsRemaining =
      this.gradebookService.selectedClass.totalPossible -
      this.gradebookService.selectedClass.completedPossible;
    for (let i = 0; i < this.gradebookService.selectedClass.items.length; i++) {
      if (i + 1 !== this.gradebookService.selectedClass.items.length) {
        // do not touch last one as it will cause an add
        const item = this.gradebookService.selectedClass.items[i];
        if (!item.isCompleted) {
          if (this.gradebookService.selectedClass.isWeighted) {
            const val =
              Math.round(
                item.weight /
                  pointsRemaining *
                  pointsNeeded /
                  item.weight *
                  item.possible *
                  10
              ) / 10;
            item.earned = val;
          } else {
            const val =
              Math.round(item.possible / pointsRemaining * pointsNeeded * 10) /
              10;
            item.earned = val;
          }
          this.save(item, false);
          console.log(item);
        }
      }
    }
    this.gradebookService.setDataSource(false);
    this.gradebookService.updateClassStats();
  }

  getAll(classId: number): Observable<any> {
    return this.webApiItemService.getAll(classId).map(result => {
      if (result) {
        // update grade and set to selected classes items
        const rawItems = result;
        for (const item of rawItems) {
          item.dateDue = item.dateDue !== null ? moment(item.dateDue) : '';
          item.grade = this.gradebookService.calculateGrade(
            item.earned,
            item.possible
          );
        }

        // find class and update
        const myClass = this.gradebookService.classes.find(
          x => x.id == classId
        );
        if (myClass) {
          myClass.items = result;
        }

        myClass.isItemsLoaded = true;
        this.gradebookService.setDataSource(true);
        this.gradebookService.updateClassStats();
      }
    });
  }

  add(item: Item): Observable<any> {
    const value: ItemAdd = {
      classId: this.gradebookService.selectedClass.id,
      isCompleted: item.isCompleted,
      description: item.description,
      dateDue: item.dateDue,
      earned: item.earned,
      possible: item.possible,
      weight: item.weight
    };
    return this.webApiItemService.add(value).map(result => {
      item.id = result;
      item.grade = this.gradebookService.calculateGrade(
        item.earned,
        item.possible
      );
      this.gradebookService.setDataSource(true);
      return Observable.of(true);
    });
  }

  update(item: Item): Observable<any> {
    const value: ItemEdit = {
      id: item.id,
      isCompleted: item.isCompleted,
      description: item.description,
      dateDue: item.dateDue,
      earned: item.earned,
      possible: item.possible,
      weight: item.weight
    };
    return this.webApiItemService.update(value).map(result => {
      item.grade = this.gradebookService.calculateGrade(
        item.earned,
        item.possible
      );
    });
  }

  delete(id: number): Observable<any> {
    return this.webApiItemService.delete(id).map(result => {
      // delete from items
      const selectedClassItem = this.gradebookService.selectedClass.items.find(
        x => x.id == id
      );
      this.gradebookService.selectedClass.items = this.gradebookService.selectedClass.items.filter(
        x => x !== selectedClassItem
      );
      this.gradebookService.setDataSource(false);
      this.gradebookService.updateClassStats();
    });
  }

  private save(item: Item, updateClassStats: boolean) {
    if (updateClassStats) {
      this.gradebookService.updateClassStats();
    }

    if (item.id === null || item.id === undefined) {
      // add
      return this.add(item).subscribe(result => {
        if (result) {
          item.id = result;
          item.grade = this.gradebookService.calculateGrade(
            item.earned,
            item.possible
          );
          this.gradebookService.setDataSource(true);
          return true;
        }
      });
    } else {
      // update
      return this.update(item).subscribe(result => {
        if (result) {
          item.grade = this.gradebookService.calculateGrade(
            item.earned,
            item.possible
          );
          return true;
        }
      });
    }
  }
}
