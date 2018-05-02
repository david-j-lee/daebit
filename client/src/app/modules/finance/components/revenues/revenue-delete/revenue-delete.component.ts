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

import { RevenueEdit } from 'finance/interfaces/revenues/revenue-edit.interface';
import { Revenue } from 'finance/interfaces/revenues/revenue.interface';

@Component({
  selector: 'app-revenue-delete',
  template: ''
})
export class RevenueDeleteComponent implements OnInit {
  matDialogRef: MatDialogRef<RevenueDeleteDialogComponent>;

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private financeService: FinanceService
  ) {}

  ngOnInit() {
    this.activatedRoute.parent.params.subscribe(parentParams => {
      this.activatedRoute.params.subscribe(params => {
        setTimeout(() => {
          this.matDialogRef = this.matDialog.open(
            RevenueDeleteDialogComponent,
            { data: { id: params.id } }
          );
          this.matDialogRef.afterClosed().subscribe((result: string) => {
            this.matDialogRef = null;
            // need to check action for navigation with back button
            const action = this.router.url.split('/')[
              this.router.url.split('/').length - 1
            ];
            if (action !== 'edit') {
              this.router.navigate(['/budget', parentParams.budgetId]);
            }
          });
        });
      });
    });
  }
}

@Component({
  selector: 'app-revenue-delete-dialog',
  templateUrl: 'revenue-delete.component.html',
  styleUrls: ['revenue-delete.component.scss']
})
export class RevenueDeleteDialogComponent implements OnInit {
  errors: string;
  isRequesting: boolean;
  submitted = false;

  deleteRevenue: Revenue;

  constructor(
    private userService: AccountService,
    private financeService: FinanceService,
    private revenueService: RevenueService,
    private dailyService: DailyService,
    private chartService: ChartService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
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

  getData() {
    // Get Balance
    const revenue = this.financeService.selectedBudget.revenues.find(
      x => x.id == this.data.id
    );
    this.deleteRevenue = revenue;
  }

  delete() {
    this.revenueService.delete(this.deleteRevenue.id).subscribe(
      (result: any) => {
        if (result) {
          this.matDialogRef.close();
          this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });
          if (this.financeService.selectedBudget.expenses) {
            const deletedRevenue = this.financeService.selectedBudget.revenues.find(
              data => data.id === this.deleteRevenue.id
            );
            if (deletedRevenue) {
              this.financeService.selectedBudget.revenues.splice(
                this.financeService.selectedBudget.revenues.indexOf(
                  deletedRevenue
                ),
                1
              );

              this.matDialogRef.close();
              this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });

              // update daily data and chart
              this.dailyService.deleteRevenue(deletedRevenue);
              this.dailyService.setRunningTotals();
              this.chartService.setChartRevenue();
              this.chartService.setChartBudget();
            }
          }
        }
      },
      (errors: any) => {
        this.errors = errors;
      }
    );
  }
}
