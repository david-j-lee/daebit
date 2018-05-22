import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';

import { AccountService } from 'account/services/account.service';
import { GradebookService } from 'gradebook/services/gradebook.service';
import { DalClassService } from 'gradebook/services/dal/dal.class.service';

import { Class } from 'gradebook/interfaces/class.interface';
import { ClassAdd } from 'gradebook/interfaces/class-add.interface';

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-class-add',
  template: ''
})
export class ClassAddComponent implements OnInit {
  matDialogRef: MatDialogRef<ClassAddDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private gradebookService: GradebookService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(ClassAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        if (this.gradebookService.selectedClass === undefined) {
          this.router.navigate(['/gradebooks']);
        } else {
          this.router.navigate([
            '/gradebook',
            this.gradebookService.selectedClass.id
          ]);
        }
      });
    });
  }
}

@Component({
  selector: 'app-class-add-dialog',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassAddDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  myClass: ClassAdd;

  constructor(
    private router: Router,
    private userService: AccountService,
    public gradebookService: GradebookService,
    private dalClassService: DalClassService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<ClassAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myClass = { name: '', isWeighted: false };
  }

  create({ value, valid }: { value: ClassAdd; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.dalClassService
        .add(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            // currently have to force another navigation or
            // other links are not clickable. Need to look into a
            // way to refresh the router without a navigate as
            // the modal close event should be handling this
            this.router.navigate([
              '/gradebook/',
              this.gradebookService.selectedClass.id
            ]);

            this.matDialogRef.close();
            this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }
}
