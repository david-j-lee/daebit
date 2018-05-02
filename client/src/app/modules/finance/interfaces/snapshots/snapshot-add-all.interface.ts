import { SnapshotAdd } from 'finance/interfaces/snapshots/snapshot-add.interface';
import { SnapshotBalanceAdd } from 'finance/interfaces/snapshots/snapshot-balance-add.interface';

export interface SnapshotAddAll {
    budgetId: number;
    snapshot: SnapshotAdd;
    snapshotBalances: SnapshotBalanceAdd[];
}
