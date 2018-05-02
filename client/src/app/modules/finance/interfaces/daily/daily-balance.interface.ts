import { Day } from 'finance/interfaces/daily/day.interface';
import { Balance } from 'finance/interfaces/balances/balance.interface';

export interface DailyBalance {
    day: Day;
    balance: Balance;
    amount: number;
}
