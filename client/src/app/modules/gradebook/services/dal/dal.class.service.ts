import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WebApiClassService } from 'gradebook/services/web-api/web-api.class.service';
import { GradebookService } from 'gradebook/services/gradebook.service';

import { Class } from 'gradebook/interfaces/class.interface';
import { ClassAdd } from 'gradebook/interfaces/class-add.interface';
import { ClassEdit } from 'gradebook/interfaces/class-edit.interface';

@Injectable()
export class DalClassService {
  private baseUrl = '';

  constructor(
    private webApiClassService: WebApiClassService,
    private gradebookService: GradebookService
  ) {}

  getAll(): Observable<any> {
    return this.webApiClassService.getAll().map(result => {
      this.gradebookService.classes = result;
      this.gradebookService.isLoaded = true;
      return Observable.of(true);
    });
  }

  add(value: ClassAdd): Observable<any> {
    return this.webApiClassService.add(value).map(result => {
      // add new class locally
      const newClass: Class = {
        id: result,
        isItemsLoaded: true,
        name: value.name,
        isWeighted: value.isWeighted,
        isActive: true,
        items: [],
        completed: 0,
        remaining: 0,
        total: 0,
        dateLastViewed: new Date(),
        completedEarned: 0,
        completedPossible: 0,
        completedGrade: 0,
        completedGradeColor: '',
        completedGradeText: '',
        totalEarned: 0,
        totalPossible: 0,
        totalGrade: 0,
        totalGradeColor: '',
        totalGradeText: ''
      };
      this.gradebookService.classes.push(newClass);
      this.gradebookService.selectClass(newClass);
      return Observable.of(true);
    });
  }

  update(oldClass: Class, newClass: ClassEdit): Observable<any> {
    newClass.id = oldClass.id;
    return this.webApiClassService.update(newClass).map(result => {
      oldClass.name = newClass.name;
      // update isActive and put into correct bucket
      if (oldClass.isActive !== newClass.isActive) {
        oldClass.isActive = newClass.isActive;
        this.gradebookService.classes = this.gradebookService.classes;
      }
      // Update is weighted and setup new columns
      if (oldClass.isWeighted !== newClass.isWeighted) {
        oldClass.isWeighted = newClass.isWeighted;
        this.gradebookService.updateClassStats();
      }
      return Observable.of(true);
    });
  }

  delete(id: number): Observable<any> {
    return this.webApiClassService.delete(id).map(result => {
      if (this.gradebookService.classes) {
        const deletedClass = this.gradebookService.classes.find(
          data => data.id === id
        );
        if (deletedClass) {
          this.gradebookService.classes.splice(
            this.gradebookService.classes.indexOf(deletedClass),
            1
          );
        }
      }
      return Observable.of(true);
    });
  }
}
