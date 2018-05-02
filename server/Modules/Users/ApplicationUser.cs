using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Gradebook.Classes;

namespace Daebit.Modules.Users
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Extension { get; set; }
        public string Theme { get; set; }

        // Relationships
        public virtual ICollection<Budget> Budgets { get; set; }
        public virtual ICollection<Class> Classes { get; set; }
    }
}
