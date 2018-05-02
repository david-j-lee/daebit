using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Users;

namespace Daebit.Modules.Finance.Balances.ViewModels
{
    public class BalanceGetViewModel
    {
        public virtual int Id { get; set; }
        public virtual string Description { get; set; }
        public virtual decimal Amount { get; set; }
    }
}