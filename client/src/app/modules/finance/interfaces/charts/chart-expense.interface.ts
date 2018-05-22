import { Expense } from 'finance/interfaces/expenses/expense.interface';

export interface ChartExpense {
    chartType: string;
    options: any;
    colors: any;
    labels: string[];
    data: number[];
    total: number;
}
