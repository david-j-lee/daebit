using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Expenses
{
    public class Expense
    {
        public virtual int Id { get; set; }

        [Required(ErrorMessage = "A description is required")]
        [StringLength(20, ErrorMessage = "Please shorten your description")]
        public virtual string Description { get; set; }

        [Required(ErrorMessage = "An amount is required")]
        [DisplayFormat(DataFormatString = "{0:n}")]
        public virtual decimal Amount { get; set; }

        public virtual bool IsForever { get; set; }

        [DisplayName("Start")]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        public virtual DateTime? StartDate { get; set; }

        [DisplayName("End")]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        public virtual DateTime? EndDate { get; set; }

        [DisplayName("M")]
        public virtual bool RepeatMon { get; set; }
        [DisplayName("Tu")]
        public virtual bool RepeatTue { get; set; }
        [DisplayName("W")]
        public virtual bool RepeatWed { get; set; }
        [DisplayName("Th")]
        public virtual bool RepeatThu { get; set; }
        [DisplayName("F")]
        public virtual bool RepeatFri { get; set; }
        [DisplayName("Sa")]
        public virtual bool RepeatSat { get; set; }
        [DisplayName("Su")]
        public virtual bool RepeatSun { get; set; }

        public virtual string Frequency { get; set; }

        // Relationships
        public virtual int BudgetId { get; set; }
        [ForeignKey("BudgetId")]
        public virtual Budget Budget { get; set; }
    }
}