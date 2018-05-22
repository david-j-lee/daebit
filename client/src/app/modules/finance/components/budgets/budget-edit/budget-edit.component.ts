import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/finally';

import { FinanceService } from 'finance/services/finance.service';
import { DalBudgetService } from 'finance/services/dal/dal.budget.service';

import { Budget } from 'finance/interfaces/budgets/budget.interface';
import { BudgetEdit } from 'finance/interfaces/budgets/budget-edit.interface';

import { BudgetDeleteComponent } from 'finance/components/budgets/budget-delete/budget-delete.component';

@Component({
  selector: 'app-budget-edit',
  template: ''
})
export class BudgetEditComponent implements OnInit {
  matDialogRef: MatDialogRef<BudgetEditDialogComponent>;

  constructor(
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(BudgetEditDialogComponent);
    });
  }
}

@Component({
  selector: 'app-budget-edit-dialog',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.scss']
})
export class BudgetEditDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  oldBudget: Budget;
  newBudget: BudgetEdit;

  navigateToDelete = false;
  deleteModal: MatDialogRef<BudgetDeleteComponent>;

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBudgetService: DalBudgetService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BudgetEditDialogComponent>
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    this.oldBudget = this.financeService.selectedBudget;
    this.newBudget = {
      id: this.oldBudget.id,
      name: this.oldBudget.name,
      isActive: this.oldBudget.isActive
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
            '/budget',
            this.financeService.selectedBudget.id
          ]);
        } else {
          this.router.navigate([
            '/budget',
            this.financeService.selectedBudget.id,
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

  edit({ value, valid }: { value: BudgetEdit; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    if (valid) {
      value.id = this.oldBudget.id;
      this.dalBudgetService
        .update(this.oldBudget, value)
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
