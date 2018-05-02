import { Day } from 'finance/interfaces/daily/day.interface';
import { Expense } from 'finance/interfaces/expenses/expense.interface';

export interface DailyExpense {
    day: Day;
    expense: Expense;
    amount: number;
}
