using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Snapshots.ViewModels
{
    public class SnapshotAddAllViewModel
    {
        public virtual int BudgetId { get; set; }
        public virtual SnapshotAddViewModel Snapshot { get; set; }
        public virtual ICollection<SnapshotBalanceAddViewModel> SnapshotBalances { get; set; }
    }
}
