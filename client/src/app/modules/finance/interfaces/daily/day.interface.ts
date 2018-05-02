import { Moment } from 'moment';

import { DailyBalance } from 'finance/interfaces/daily/daily-balance.interface';
import { DailyExpense } from 'finance/interfaces/daily/daily-expense.interface';
import { DailyRevenue } from 'finance/interfaces/daily/daily-revenue.interface';

export interface Day {
    date: Moment;
    month: number;
    year: number;

    dailyBalances: DailyBalance[];
    dailyRevenues: DailyRevenue[];
    dailyExpenses: DailyExpense[];

    totalBalance: number;
    totalRevenue: number;
    totalExpense: number;
    balance: number;
}
