using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Balances
{
    public class Balance
    {
        public virtual int Id { get; set; }

        [Required(ErrorMessage="A description is required")]
        [StringLength(20, ErrorMessage = "Please shorten your description")]
        public virtual string Description { get; set; }

        [Required(ErrorMessage = "An amount is required")]
        [DisplayFormat(DataFormatString = "{0:n}")]
        public virtual decimal Amount { get; set; }

        // Relationships
        public virtual int BudgetId { get; set; }
        [ForeignKey("BudgetId")]
        public virtual Budget Budget { get; set; }
    }
}