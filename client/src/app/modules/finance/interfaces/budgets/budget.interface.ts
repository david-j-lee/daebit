import { Moment } from 'moment';

import { Balance } from 'finance/interfaces/balances/balance.interface';
import { Revenue } from 'finance/interfaces/revenues/revenue.interface';
import { Expense } from 'finance/interfaces/expenses/expense.interface';
import { Snapshot } from 'finance/interfaces/snapshots/snapshot.interface';
import { Day } from 'finance/interfaces/daily/day.interface';

export interface Budget {
    id: number;
    isBalancesLoaded: boolean;
    isRevenuesLoaded: boolean;
    isExpensesLoaded: boolean;
    isSnapshotsLoaded: boolean;

    name: string;
    startDate: Moment;
    isActive: boolean;

    balances: Balance[];
    revenues: Revenue[];
    expenses: Expense[];

    snapshots: Snapshot[];

    days: Day[];
}
