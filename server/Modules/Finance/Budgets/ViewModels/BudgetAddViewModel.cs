using System;

namespace Daebit.Modules.Finance.Budgets.ViewModels
{
    public class BudgetAddViewModel
    {
        public bool IsActive { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
    }
}