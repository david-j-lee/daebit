import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import * as moment from 'moment';

import { FinanceService } from 'finance/services/finance.service';
import { DalBudgetService } from 'finance/services/dal/dal.budget.service';

import { Budget } from 'finance/interfaces/budgets/budget.interface';
import { BudgetAdd } from 'finance/interfaces/budgets/budget-add.interface';
import { Snapshot } from 'finance/interfaces/snapshots/snapshot.interface';

@Component({
  selector: 'app-budget-add',
  template: ''
})
export class BudgetAddComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetAddDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        if (this.financeService.selectedBudget) {
          this.router.navigate([
            '/budget',
            this.financeService.selectedBudget.id
          ]);
        } else {
          this.router.navigate(['/budgets']);
        }
      });
    });
  }
}

@Component({
  selector: 'app-budget-add-dialog',
  templateUrl: 'budget-add.component.html',
  styleUrls: ['./budget-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetAddDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  myBudget: BudgetAdd;

  constructor(
    private dalBudgetService: DalBudgetService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BudgetAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myBudget = { name: '', startDate: moment() };
  }

  create({ value, valid }: { value: BudgetAdd; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.dalBudgetService
        .add(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
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
