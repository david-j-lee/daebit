using System;

namespace Daebit.Modules.Gradebook.Items.ViewModels
{
    public class ItemGetViewModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DateDue { get; set; }

        public double Earned { get; set; }
        public double Possible { get; set; }
        public double Weight { get; set; }
    }
}