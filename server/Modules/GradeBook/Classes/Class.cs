using System;
using System.Collections.Generic;
using System.Linq;
using Daebit.Modules.Gradebook.Items;
using Daebit.Modules.Users;

namespace Daebit.Modules.Gradebook.Classes
{
    public class Class
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsWeighted { get; set; }
        public bool IsActive { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateLastEdit { get; set; }
        public DateTime DateLastViewed { get; set; }
        
        // Relationships
        public virtual ICollection<Item> Items { get; set; }

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        // Calculated Fields
        public int Completed { get { return Items.Where(x => x.IsCompleted).Count(); } }
        public int Remaining { get  { return Items.Where(x => !x.IsCompleted).Count(); } }
        public int Total { get  { return Items.Count(); } }
        public double CompletedEarned { get { return Items.Where(x => x.IsCompleted).Sum(x => x.Earned); } }
        public double CompletedPossible { get { return Items.Where(x => x.IsCompleted).Sum(x => x.Possible); } }
        public double CompletedGrade { get { return CompletedPossible != 0 ? CompletedEarned / CompletedPossible : 0; } }
        public double TotalEarned { get { return Items.Sum(x => x.Earned); } }
        public double TotalPossible { get { return Items.Sum(x => x.Possible); } }
        public double TotalGrade { get { return TotalPossible != 0 ? TotalEarned / TotalPossible : 0; } }
    }
}