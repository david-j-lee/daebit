import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from '@angular/material';

import { FinanceService } from 'finance/services/finance.service';
import { DalBalanceService } from 'finance/services/dal/dal.balance.service';

import { Balance } from 'finance/interfaces/balances/balance.interface';
import { BalanceAdd } from 'finance/interfaces/balances/balance-add.interface';
import { BalanceEdit } from 'finance/interfaces/balances/balance-edit.interface';

import { BalanceDeleteComponent } from 'finance/components/balances/balance-delete/balance-delete.component';

@Component({
  selector: 'app-balance-edit',
  template: ''
})
export class BalanceEditComponent implements OnInit {
  matDialogRef: MatDialogRef<BalanceEditDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(parentParams => {
      this.activatedRoute.params.subscribe(params => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(BalanceEditDialogComponent, {
            data: { id: params['id'] }
          });
        });
      });
    });
  }
}

@Component({
  selector: 'app-balance-edit-dialog',
  templateUrl: 'balance-edit.component.html',
  styleUrls: ['balance-edit.component.scss']
})
export class BalanceEditDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  oldBalance: Balance;
  newBalance: BalanceAdd;

  navigateToDelete = false;
  deleteModal: MatDialogRef<BalanceDeleteComponent>;

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private dalBalanceService: DalBalanceService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<BalanceEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    // Get Balance
    if (this.financeService.selectedBudget.balances) {
      this.getData();
    } else {
      this.dalBalanceService
        .getAll(this.financeService.selectedBudget.id)
        .subscribe(result => {
          if (result) {
            this.getData();
          }
        });
    }
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
            './budget',
            this.financeService.selectedBudget.id,
            'balance',
            this.oldBalance.id,
            'delete'
          ]);
        }
      }
    });
  }

  getData() {
    const balance = this.financeService.selectedBudget.balances.find(
      x => x.id == this.data.id
    );
    this.oldBalance = balance;
    this.newBalance = {
      description: this.oldBalance.description,
      amount: this.oldBalance.amount,
      budgetId: undefined
    };
  }

  requestDelete() {
    this.navigateToDelete = true;
    this.matDialogRef.close();
  }

  edit({ value, valid }: { value: BalanceEdit; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    if (valid) {
      this.dalBalanceService
        .update(this.oldBalance, value)
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
