using System;
using Daebit.Modules.Gradebook.Classes;

namespace Daebit.Modules.Gradebook.Items
{
    public class Item
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public bool IsCompleted { get; set; }
        public DateTime? DateDue { get; set; }

        public double Earned { get; set; }
        public double Possible { get; set; }
        public double Weight { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateLastEdit { get; set; }

        // Relationships
        public int ClassId { get; set; }
        public virtual Class Class { get; set; }

        // Calculated Fields
        public double Grade { get { return Possible != 0 ? Earned / Possible : 0; } }
    }
}