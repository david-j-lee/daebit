import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FinanceRouting } from 'finance/finance.routing';
import { MaterialModule } from 'material/material.module';
import { UiModule } from 'ui/ui.module';
import { CoreModule } from 'core/core.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AccountModule } from 'account/account.module';

// Services
import { FinanceService } from 'finance/services/finance.service';

import { BalanceService } from 'finance/services/api/balance.service';
import { BudgetService } from 'finance/services/api/budget.service';
import { ExpenseService } from 'finance/services/api/expense.service';
import { RevenueService } from 'finance/services/api/revenue.service';
import { SnapshotService } from 'finance/services/api/snapshot.service';

import { SideBarService } from 'finance/services/side-bar.service';

import { DailyService } from 'finance/services/daily.service';
import { ChartService } from 'finance/services/chart.service';
import { CalendarService } from './services/calendar.service';

// Components
import { FinanceComponent } from './finance.component';
import { GettingStartedComponent } from 'finance/components/getting-started/getting-started.component';
import { ToolbarComponent } from 'finance/components/toolbar/toolbar.component';
import { WizardComponent } from 'finance/components/wizard/wizard.component';
import { SidebarComponent } from 'finance/components/sidebar/sidebar.component';
import { CalendarComponent } from 'finance/components/calendar/calendar.component';

// balances
import {
  BalanceAddComponent,
  BalanceAddDialogComponent
} from 'finance/components/balances/balance-add/balance-add.component';
import {
  BalanceDeleteComponent,
  BalanceDeleteDialogComponent
} from 'finance/components/balances/balance-delete/balance-delete.component';
import {
  BalanceEditComponent,
  BalanceEditDialogComponent
} from 'finance/components/balances/balance-edit/balance-edit.component';
import { BalancePieChartComponent } from 'finance/components/balances/balance-pie-chart/balance-pie-chart.component';
import { BalanceTableComponent } from 'finance/components/balances/balance-table/balance-table.component';

// budgets
import {
  BudgetAddComponent,
  BudgetAddDialogComponent
} from 'finance/components/budgets/budget-add/budget-add.component';
import { BudgetChartComponent } from 'finance/components/budgets/budget-chart/budget-chart.component';
import {
  BudgetDeleteComponent,
  BudgetDeleteDialogComponent
} from 'finance/components/budgets/budget-delete/budget-delete.component.ts';
import {
  BudgetEditComponent,
  BudgetEditDialogComponent
} from 'finance/components/budgets/budget-edit/budget-edit.component.ts';
import { BudgetListingComponent } from 'finance/components/budgets/budget-listing/budget-listing.component';
import { BudgetDashboardComponent } from 'finance/components/budgets/budget-dashboard/budget-dashboard.component';

// expenses
import {
  ExpenseAddComponent,
  ExpenseAddDialogComponent
} from 'finance/components/expenses/expense-add/expense-add.component';
import {
  ExpenseDeleteComponent,
  ExpenseDeleteDialogComponent
} from 'finance/components/expenses/expense-delete/expense-delete.component';
import {
  ExpenseEditComponent,
  ExpenseEditDialogComponent
} from 'finance/components/expenses/expense-edit/expense-edit.component';
import { ExpensePieChartComponent } from 'finance/components/expenses/expense-pie-chart/expense-pie-chart.component';
import { ExpenseTableComponent } from 'finance/components/expenses/expense-table/expense-table.component';

// revenues
import {
  RevenueAddComponent,
  RevenueAddDialogComponent
} from 'finance/components/revenues/revenue-add/revenue-add.component';
import {
  RevenueDeleteComponent,
  RevenueDeleteDialogComponent
} from 'finance/components/revenues/revenue-delete/revenue-delete.component';
import {
  RevenueEditComponent,
  RevenueEditDialogComponent
} from 'finance/components/revenues/revenue-edit/revenue-edit.component';
import { RevenuePieChartComponent } from 'finance/components/revenues/revenue-pie-chart/revenue-pie-chart.component';
import { RevenueTableComponent } from 'finance/components/revenues/revenue-table/revenue-table.component';

// snapshots
import {
  SnapshotHistoryComponent,
  SnapshotHistoryDialogComponent
} from 'finance/components/snapshots/snapshot-history/snapshot-history.component';
import {
  SnapshotTableComponent,
  SnapshotTableDialogComponent
} from 'finance/components/snapshots/snapshot-table/snapshot-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    AccountModule,
    UiModule,
    ChartsModule,
    FinanceRouting
  ],
  declarations: [
    BalanceAddComponent,
    BalanceAddDialogComponent,
    BalanceDeleteComponent,
    BalanceDeleteDialogComponent,
    BalanceEditComponent,
    BalanceEditDialogComponent,
    BalancePieChartComponent,
    BalanceTableComponent,
    BudgetAddComponent,
    BudgetAddDialogComponent,
    BudgetChartComponent,
    BudgetDashboardComponent,
    BudgetDeleteComponent,
    BudgetDeleteDialogComponent,
    BudgetEditComponent,
    BudgetEditDialogComponent,
    BudgetListingComponent,
    CalendarComponent,
    ExpenseAddComponent,
    ExpenseAddDialogComponent,
    ExpenseDeleteComponent,
    ExpenseDeleteDialogComponent,
    ExpenseEditComponent,
    ExpenseEditDialogComponent,
    ExpensePieChartComponent,
    ExpenseTableComponent,
    FinanceComponent,
    GettingStartedComponent,
    RevenueAddComponent,
    RevenueAddDialogComponent,
    RevenueDeleteComponent,
    RevenueDeleteDialogComponent,
    RevenueEditComponent,
    RevenueEditDialogComponent,
    RevenuePieChartComponent,
    RevenueTableComponent,
    SidebarComponent,
    SnapshotHistoryComponent,
    SnapshotHistoryDialogComponent,
    SnapshotTableComponent,
    SnapshotTableDialogComponent,
    ToolbarComponent,
    WizardComponent
  ],
  providers: [
    FinanceService,
    BalanceService,
    BudgetService,
    ExpenseService,
    RevenueService,
    SnapshotService,
    SideBarService,
    DailyService,
    ChartService,
    CalendarService
  ],
  entryComponents: [
    BalanceAddDialogComponent,
    BalanceDeleteDialogComponent,
    BalanceEditDialogComponent,
    BudgetAddDialogComponent,
    BudgetEditDialogComponent,
    BudgetDeleteDialogComponent,
    ExpenseAddDialogComponent,
    ExpenseDeleteDialogComponent,
    ExpenseEditDialogComponent,
    RevenueAddDialogComponent,
    RevenueDeleteDialogComponent,
    RevenueEditDialogComponent,
    SnapshotHistoryDialogComponent,
    SnapshotTableDialogComponent
  ]
})
export class FinanceModule {}
