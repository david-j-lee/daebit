import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA
} from '@angular/material';

import { FinanceService } from 'finance/services/finance.service';
import { DalRevenueService } from 'finance/services/dal/dal.revenue.service';

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
    private activatedRoute: ActivatedRoute
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
    private financeService: FinanceService,
    private dalRevenueService: DalRevenueService,
    public matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    public matDialogRef: MatDialogRef<RevenueDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.financeService.selectedBudget.revenues) {
      this.getData();
    } else {
      this.dalRevenueService
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
    this.dalRevenueService.delete(this.deleteRevenue.id).subscribe(
      (result: any) => {
        this.matDialogRef.close();
        this.matSnackBar.open('Deleted', 'Dismiss', { duration: 2000 });
      },
      (errors: any) => {
        this.errors = errors;
      }
    );
  }
}
