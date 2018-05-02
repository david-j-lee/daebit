using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Snapshots.ViewModels
{
    public class SnapshotAddViewModel
    {
        public virtual DateTime? Date { get; set; }
        public virtual double EstimatedBalance { get; set; }
        public virtual double ActualBalance { get; set; }
    }
}