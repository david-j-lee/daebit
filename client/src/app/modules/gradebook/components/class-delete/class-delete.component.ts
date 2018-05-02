import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/finally';

import { AccountService } from 'account/services/account.service';
import { GradebookService } from 'gradebook/services/gradebook.service';
import { ClassService } from 'gradebook/services/api/class.service';

import { ClassEdit } from 'gradebook/interfaces/class-edit.interface';
import { Class } from 'gradebook/interfaces/class.interface';

@Component({
  selector: 'app-class-delete',
  template: ''
})
export class ClassDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<ClassDeleteDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gradebookService: GradebookService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(ClassDeleteDialogComponent);
    });
  }
}

@Component({
  selector: 'app-class-delete-dialog',
  templateUrl: './class-delete.component.html',
  styleUrls: ['./class-delete.component.scss']
})
export class ClassDeleteDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  deleteClass: Class;

  constructor(
    private router: Router,
    private userService: AccountService,
    private gradebookService: GradebookService,
    private classService: ClassService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ClassDeleteComponent>
  ) {}

  ngOnInit() {
    this.setAfterClose();
    this.deleteClass = this.gradebookService.selectedClass;
  }

  setAfterClose() {
    this.matDialogRef.afterClosed().subscribe((result: string) => {
      this.matDialogRef = null;
      // need to check action for navigation with back button
      const action = this.router.url.split('/')[
        this.router.url.split('/').length - 1
      ];
      if (this.gradebookService.classes.length == 0) {
        this.router.navigate(['/gradebooks']);
      } else if (this.gradebookService.classes.length > 0) {
        this.router.navigate([
          '/gradebook',
          this.gradebookService.classes[0].id
        ]);
      } else if (action !== 'edit') {
        this.router.navigate([
          '/gradebook',
          this.gradebookService.selectedClass.id
        ]);
      }
    });
  }

  delete() {
    this.classService.delete(this.deleteClass.id).subscribe(
      (result: any) => {
        if (result) {
          if (this.gradebookService.classes) {
            const deletedClass = this.gradebookService.classes.find(
              data => data.id === this.deleteClass.id
            );
            if (deletedClass) {
              this.gradebookService.classes.splice(
                this.gradebookService.classes.indexOf(deletedClass),
                1
              );
            }
          }
          this.matDialogRef.close();
        }
      },
      (errors: any) => {
        this.errors = errors;
      }
    );
  }
}
