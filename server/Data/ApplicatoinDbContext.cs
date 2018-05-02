using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Daebit.Modules.Users;
using Daebit.Modules.Gradebook.Classes;
using Daebit.Modules.Gradebook.Items;
using Daebit.Modules.Finance.Budgets;
using Daebit.Modules.Finance.Balances;
using Daebit.Modules.Finance.Revenues;
using Daebit.Modules.Finance.Expenses;
using Daebit.Modules.Finance.Snapshots;

namespace Daebit.Data
{
  public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      // Finance
      builder.Entity<Budget>().HasOne(p => p.User).WithMany(c => c.Budgets).OnDelete(DeleteBehavior.Restrict);
      builder.Entity<Budget>().HasMany(p => p.Balances).WithOne(c => c.Budget).OnDelete(DeleteBehavior.Restrict);
      builder.Entity<Budget>().HasMany(p => p.Revenues).WithOne(c => c.Budget).OnDelete(DeleteBehavior.Restrict);
      builder.Entity<Budget>().HasMany(p => p.Expenses).WithOne(c => c.Budget).OnDelete(DeleteBehavior.Restrict);
      builder.Entity<Budget>().HasMany(p => p.Snapshots).WithOne(c => c.Budget).OnDelete(DeleteBehavior.Restrict);

      // Gradebook
      builder.Entity<Class>().HasOne(p => p.User).WithMany(c => c.Classes).OnDelete(DeleteBehavior.Restrict);
      builder.Entity<Class>().HasMany(p => p.Items).WithOne(c => c.Class).OnDelete(DeleteBehavior.Restrict);

      base.OnModelCreating(builder);
    }

    // Finance
    public DbSet<Budget> Budgets { get; set; }
    public DbSet<Balance> Balances { get; set; }
    public DbSet<Revenue> Revenues { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Snapshot> Snapshots { get; set; }

    // Gradebook
    public DbSet<Class> Classes { get; set; }
    public DbSet<Item> Items { get; set; }
  }
}
