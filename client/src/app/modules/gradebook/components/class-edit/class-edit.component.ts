import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import 'rxjs/add/operator/finally';

import { AccountService } from 'account/services/account.service';
import { GradebookService } from 'gradebook/services/gradebook.service';
import { ClassService } from 'gradebook/services/api/class.service';

import { ClassEdit } from 'gradebook/interfaces/class-edit.interface';
import { Class } from 'gradebook/interfaces/class.interface';

import { ClassDeleteComponent } from 'gradebook/components/class-delete/class-delete.component';

@Component({
  selector: 'app-class-edit',
  template: ''
})
export class ClassEditComponent implements OnInit {
  matDialogRef: MatDialogRef<ClassEditDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private gradebookService: GradebookService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(ClassEditDialogComponent);
    });
  }
}

@Component({
  selector: 'app-class-edit-dialog',
  templateUrl: './class-edit.component.html',
  styleUrls: ['./class-edit.component.scss']
})
export class ClassEditDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  oldClass: Class;
  newClass: ClassEdit;

  navigateToDelete = false;
  deleteModal: MatDialogRef<ClassDeleteComponent>;

  constructor(
    private router: Router,
    private userService: AccountService,
    private gradebookService: GradebookService,
    private classService: ClassService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ClassEditDialogComponent>
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    this.oldClass = this.gradebookService.selectedClass;
    this.newClass = {
      id: this.oldClass.id,
      name: this.oldClass.name,
      isWeighted: this.oldClass.isWeighted,
      isActive: this.oldClass.isActive
    };
  }

  setAfterClosed() {
    this.matDialogRef.afterClosed().subscribe((result: string) => {
      this.matDialogRef = null;
      // need to check for navigation with forward button
      const action = this.router.url.split('/')[
        this.router.url.split('/').length - 1
      ];
      if (action !== 'delete') {
        if (!this.navigateToDelete) {
          this.router.navigate([
            '/gradebook',
            this.gradebookService.selectedClass.id
          ]);
        } else {
          this.router.navigate([
            '/gradebook',
            this.gradebookService.selectedClass.id,
            'delete'
          ]);
        }
      }
    });
  }

  requestDelete() {
    this.navigateToDelete = true;
    this.matDialogRef.close();
  }

  edit({ value, valid }: { value: ClassEdit; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    if (valid) {
      value.id = this.oldClass.id;
      this.classService
        .update(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              this.oldClass.name = this.newClass.name;

              // update isActive and put into correct bucket
              if (this.oldClass.isActive !== this.newClass.isActive) {
                this.oldClass.isActive = this.newClass.isActive;
                this.gradebookService.classes = this.gradebookService.classes;
              }
              // Update is weighted and setup new columns
              if (this.oldClass.isWeighted !== this.newClass.isWeighted) {
                this.oldClass.isWeighted = this.newClass.isWeighted;
                this.gradebookService.updateClassStats();
              }

              this.matDialogRef.close();
              this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
            }
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }
}
