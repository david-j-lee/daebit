import { Day } from 'finance/interfaces/daily/day.interface';
import { Revenue } from 'finance/interfaces/revenues/revenue.interface';

export interface DailyRevenue {
    day: Day;
    revenue: Revenue;
    amount: number;
}
