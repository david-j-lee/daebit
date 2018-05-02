using AutoMapper;
using Daebit.Modules.Auth.Account.ViewModels;
using Daebit.Modules.Finance.Balances;
using Daebit.Modules.Finance.Balances.ViewModels;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Finance.Budgets.ViewModels;
using Daebit.Modules.Finance.Expenses;
using Daebit.Modules.Finance.Expenses.ViewModels;
using Daebit.Modules.Finance.Revenues;
using Daebit.Modules.Finance.Revenues.ViewModels;
using Daebit.Modules.Finance.Snapshots;
using Daebit.Modules.Finance.Snapshots.ViewModels;
using Daebit.Modules.Gradebook.Classes;
using Daebit.Modules.Gradebook.Classes.ViewModels;
using Daebit.Modules.Gradebook.Items;
using Daebit.Modules.Gradebook.Items.ViewModels;
using Daebit.Modules.Users;
using Daebit.Modules.Users.ViewModels;

namespace Daebit.Shared.Helpers
{
    public class ViewModelToEntityMappingProfile : Profile
    {
        public ViewModelToEntityMappingProfile()
        {
            // Organization
            CreateMap<RegistrationViewModel, ApplicationUser>().ForMember(au => au.UserName, map => map.MapFrom(vm => vm.Email));
            CreateMap<ApplicationUser, UserGetViewModel>();

            CreateMap<Budget, BudgetGetViewModel>();

            CreateMap<Balance, BalanceGetViewModel>();
            CreateMap<Expense, ExpenseGetViewModel>();
            CreateMap<Revenue, RevenueGetViewModel>();
            CreateMap<Snapshot, SnapshotGetViewModel>();

            // CreateMap<Item, ItemAddViewModel>();
            // CreateMap<Item, ItemEditViewModel>();
            CreateMap<Item, ItemGetViewModel>();

            // CreateMap<Class, ClassAddViewModel>();
            // CreateMap<Class, ClassEditViewModel>();
            CreateMap<Class, ClassGetViewModel>();
        }
    }
}