// /*
//     This service handles dialogs used for balances, revenues and expenses
// */

// import { Injectable } from '@angular/core';
// import { MatDialog } from '@angular/material';

// import { BaseService } from 'core/services/base.service';
// import { AccountService } from 'account/services/account.service';
// import { DailyService } from 'finance/services/daily.service';

// import { Budget } from 'finance/interfaces/budgets/budget.interface';

// import { BalanceAddComponent } from 'finance/components/balances/balance-add/balance-add.component';
// import { BalanceEditComponent } from 'finance/components/balances/balance-edit/balance-edit.component';
// import { BalanceDeleteComponent } from 'finance/components/balances/balance-delete/balance-delete.component';

// import { RevenueAddComponent } from 'finance/components/revenues/revenue-add/revenue-add.component';
// import { RevenueEditComponent } from 'finance/components/revenues/revenue-edit/revenue-edit.component';
// import { RevenueDeleteComponent } from 'finance/components/revenues/revenue-delete/revenue-delete.component';

// import { ExpenseAddComponent } from 'finance/components/expenses/expense-add/expense-add.component';
// import { ExpenseEditComponent } from 'finance/components/expenses/expense-edit/expense-edit.component';
// import { ExpenseDeleteComponent } from 'finance/components/expenses/expense-delete/expense-delete.component';

// import { SnapshotHistoryComponent } from 'finance/components/snapshots/snapshot-history/snapshot-history.component';
// import { SnapshotTableComponent } from 'finance/components/snapshots/snapshot-table/snapshot-table.component';

// @Injectable()
// export class ItemDialogService {

//     constructor(
//         private dailyService: DailyService,
//         private userService: AccountService,
//         public matDialog: MatDialog
//     ) { }

//     addBalance() {
//         const modalRef = this.matDialog.open(BalanceAddComponent);
//     }

//     addExpense() {
//         const modalRef = this.matDialog.open(ExpenseAddComponent);
//     }

//     addRevenue() {
//         const modalRef = this.matDialog.open(RevenueAddComponent);
//     }

//     addSnapshot() {
//         const modalRef = this.matDialog.open(SnapshotTableComponent);
//     }

//     viewSnapshots() {
//         const modalRef = this.matDialog.open(SnapshotHistoryComponent);
//     }

//     checkDialogBalances(action: string, id: number) {
//         switch (action) {
//             case 'add':
//                 this.matDialog.open(BalanceAddComponent);
//                 break;
//             case 'delete':
//                 this.matDialog.open(BalanceDeleteComponent, { data: { id: id } });
//                 break;
//             case 'edit':
//                 this.matDialog.open(BalanceEditComponent, { data: { id: id } });
//                 break;
//         }
//     }

//     checkDialogExpenses(action: string, id: number) {
//         switch (action) {
//             case 'add':
//                 this.matDialog.open(ExpenseAddComponent);
//                 break;
//             case 'delete':
//                 this.matDialog.open(ExpenseDeleteComponent, { data: { id: id } });
//                 break;
//             case 'edit':
//                 this.matDialog.open(ExpenseEditComponent, { data: { id: id } });
//                 break;
//         }
//     }

//     checkDialogRevenues(action: string, id: number) {
//         switch (action) {
//             case 'add':
//                 this.matDialog.open(RevenueAddComponent);
//                 break;
//             case 'delete':
//                 this.matDialog.open(RevenueDeleteComponent, { data: { id: id } });
//                 break;
//             case 'edit':
//                 this.matDialog.open(RevenueEditComponent, { data: { id: id } });
//                 break;
//         }
//     }

//     checkDialogSnapshots(action: string) {
//         switch (action) {
//             case 'add':
//                 this.matDialog.open(SnapshotTableComponent);
//                 break;
//             case 'view':
//                 this.matDialog.open(SnapshotHistoryComponent);
//                 break;
//         }
//     }
// }
