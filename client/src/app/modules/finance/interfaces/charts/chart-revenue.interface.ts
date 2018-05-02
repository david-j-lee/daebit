import { Revenue } from 'finance/interfaces/revenues/revenue.interface';

export interface ChartRevenue {
    chartType: string;
    options: any;
    colors: any;
    labels: string[];
    data: number[];
}
