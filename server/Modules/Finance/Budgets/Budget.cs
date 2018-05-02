using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Daebit.Modules.Finance.Balances;
using Daebit.Modules.Finance.Expenses;
using Daebit.Modules.Finance.Revenues;
using Daebit.Modules.Finance.Snapshots;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Budgets
{
    public class Budget
    {
        public virtual int Id { get; set; }

        public virtual bool IsActive { get; set; }

        [Required(ErrorMessage = "A name is required")]
        [StringLength(10, ErrorMessage = "Please shorten the name")]
        public virtual string Name { get; set; }

        public virtual DateTime? LastViewedDate { get; set; }

        // Relationships
        public virtual string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        // Relationships with
        public virtual ICollection<Balance> Balances { get; set; }
        public virtual ICollection<Revenue> Revenues { get; set; }
        public virtual ICollection<Expense> Expenses { get; set; }
        public virtual ICollection<Snapshot> Snapshots { get; set; }
    }
}