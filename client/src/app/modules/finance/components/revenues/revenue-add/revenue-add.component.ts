import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';

import { FinanceService } from 'finance/services/finance.service';
import { DalRevenueService } from 'finance/services/dal/dal.revenue.service';

import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { RevenueAdd } from 'finance/interfaces/revenues/revenue-add.interface';

@Component({
  selector: 'app-revenue-add',
  template: ''
})
export class RevenueAddComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueAddDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.matDialogRef = this.matDialog.open(RevenueAddDialogComponent);
      this.matDialogRef.afterClosed().subscribe((result: string) => {
        this.matDialogRef = null;
        this.router.navigate([
          '/budget',
          this.financeService.selectedBudget.id
        ]);
      });
    });
  }
}

@Component({
  selector: 'app-revenue-add-dialog',
  templateUrl: 'revenue-add.component.html',
  styleUrls: ['revenue-add.component.scss']
})
export class RevenueAddDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  myRevenue: RevenueAdd;

  constructor(
    public financeService: FinanceService,
    private dalRevenueService: DalRevenueService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueAddDialogComponent>
  ) {}

  ngOnInit() {
    this.myRevenue = {
      budgetId: undefined,
      description: '',
      amount: undefined,
      isForever: true,
      frequency: undefined,
      startDate: undefined,
      endDate: undefined,
      repeatMon: false,
      repeatTue: false,
      repeatWed: false,
      repeatThu: false,
      repeatFri: false,
      repeatSat: false,
      repeatSun: false
    };
  }

  create({ value, valid }: { value: RevenueAdd; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.dalRevenueService
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
