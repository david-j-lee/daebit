using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Expenses.ViewModels
{
    public class ExpenseGetViewModel
    {
        public virtual int Id { get; set; }

        public virtual string Description { get; set; }
        public virtual decimal Amount { get; set; }

        public virtual bool IsForever { get; set; }
        public virtual DateTime? StartDate { get; set; }
        public virtual DateTime? EndDate { get; set; }

        public virtual bool RepeatMon { get; set; }
        public virtual bool RepeatTue { get; set; }
        public virtual bool RepeatWed { get; set; }
        public virtual bool RepeatThu { get; set; }
        public virtual bool RepeatFri { get; set; }
        public virtual bool RepeatSat { get; set; }
        public virtual bool RepeatSun { get; set; }

        public virtual string Frequency { get; set; }
    }
}