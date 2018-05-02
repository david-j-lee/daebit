import { Moment } from 'moment';

export interface Snapshot {
    id: number;
    date: Moment;
    estimatedBalance: number;
    actualBalance: number;
    balanceDifference: number;
}
