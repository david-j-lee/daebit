import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from '@angular/material';

import { AccountService } from 'account/services/account.service';
import { FinanceService } from 'finance/services/finance.service';
import { RevenueService } from 'finance/services/api/revenue.service';
import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';

import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { RevenueAdd } from 'finance/interfaces/revenues/revenue-add.interface';
import { RevenueEdit } from 'finance/interfaces/revenues/revenue-edit.interface';

import { RevenueDeleteComponent } from 'finance/components/revenues/revenue-delete/revenue-delete.component';

@Component({
  selector: 'app-revenue-edit',
  template: ''
})
export class RevenueEditComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueEditDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private financeService: FinanceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(parentParams => {
      this.activatedRoute.params.subscribe(params => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(RevenueEditDialogComponent, {
            data: { id: params['id'] }
          });
        });
      });
    });
  }
}

@Component({
  selector: 'app-revenue-edit-dialog',
  templateUrl: 'revenue-edit.component.html',
  styleUrls: ['revenue-edit.component.scss']
})
export class RevenueEditDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  oldRevenue: Revenue;
  newRevenue: RevenueAdd;

  navigateToDelete = false;
  deleteModal: MatDialogRef<RevenueDeleteComponent>;

  constructor(
    public financeService: FinanceService,
    private router: Router,
    private userService: AccountService,
    private revenueService: RevenueService,
    private dailyService: DailyService,
    private chartService: ChartService,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.setAfterClosed();
    // Get Balance
    if (this.financeService.selectedBudget.revenues) {
      this.getData();
    } else {
      this.revenueService
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
            'revenue',
            this.oldRevenue.id,
            'delete'
          ]);
        }
      }
    });
  }

  getData() {
    // Get Revenue
    const revenue = this.financeService.selectedBudget.revenues.find(
      x => x.id == this.data.id
    );
    this.oldRevenue = revenue;
    this.newRevenue = {
      description: this.oldRevenue.description,
      amount: this.oldRevenue.amount,
      isForever: this.oldRevenue.isForever,
      frequency: this.oldRevenue.frequency,
      startDate: this.oldRevenue.startDate,
      endDate: this.oldRevenue.endDate,
      repeatMon: this.oldRevenue.repeatMon,
      repeatTue: this.oldRevenue.repeatTue,
      repeatWed: this.oldRevenue.repeatWed,
      repeatThu: this.oldRevenue.repeatThu,
      repeatFri: this.oldRevenue.repeatFri,
      repeatSat: this.oldRevenue.repeatSat,
      repeatSun: this.oldRevenue.repeatSun,
      budgetId: undefined
    };
  }

  requestDelete() {
    this.navigateToDelete = true;
    this.matDialogRef.close();
  }

  edit({ value, valid }: { value: RevenueEdit; valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    if (valid) {
      value.id = this.oldRevenue.id;
      this.revenueService
        .update(value)
        .finally(() => (this.isRequesting = false))
        .subscribe(
          (result: any) => {
            if (result) {
              this.oldRevenue.description = this.newRevenue.description;
              this.oldRevenue.amount = this.newRevenue.amount;
              this.oldRevenue.isForever = this.newRevenue.isForever;
              this.oldRevenue.frequency = this.newRevenue.frequency;
              this.oldRevenue.startDate = this.newRevenue.startDate;
              this.oldRevenue.endDate = this.newRevenue.endDate;
              this.oldRevenue.repeatMon = this.newRevenue.repeatMon;
              this.oldRevenue.repeatTue = this.newRevenue.repeatTue;
              this.oldRevenue.repeatWed = this.newRevenue.repeatWed;
              this.oldRevenue.repeatThu = this.newRevenue.repeatThu;
              this.oldRevenue.repeatFri = this.newRevenue.repeatFri;
              this.oldRevenue.repeatSat = this.newRevenue.repeatSat;
              this.oldRevenue.repeatSun = this.newRevenue.repeatSun;

              this.matDialogRef.close();
              this.matSnackBar.open('Saved', 'Dismiss', { duration: 2000 });

              // update daily data and charts
              this.dailyService.deleteRevenue(this.oldRevenue);
              this.dailyService.generateRevenue(this.oldRevenue);
              this.oldRevenue.yearlyAmount = this.dailyService.getYearlyAmountRevenue(
                this.oldRevenue
              );
              this.dailyService.setRunningTotals();
              this.chartService.setChartRevenue();
              this.chartService.setChartBudget();
            }
          },
          (errors: any) => {
            this.errors = errors;
          }
        );
    }
  }
}
