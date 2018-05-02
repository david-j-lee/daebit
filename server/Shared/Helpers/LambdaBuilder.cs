using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Daebit.Shared.Enums;
using Microsoft.EntityFrameworkCore;

namespace Daebit.Shared.Helpers
{
  public class LambdaBuilder
  {
    public static Expression<Func<TEntity, bool>> BuildLambdaForFindByKey<TEntity>(int id)
    {
      var item = Expression.Parameter(typeof(TEntity), "entity");
      //var prop = Expression.Property(item, typeof(TEntity).Name + "Id");
      var prop = Expression.Property(item, "Id");
      var value = Expression.Constant(id);
      var equal = Expression.Equal(prop, value);
      var lambda = Expression.Lambda<Func<TEntity, bool>>(equal, item);
      return lambda;
    }

    private static EntityState ConvertState(ObjectState state)
    {
      switch (state)
      {
        case ObjectState.Added:
          return EntityState.Added;

        case ObjectState.Modified:
          return EntityState.Modified;

        case ObjectState.Deleted:
          return EntityState.Deleted;

        default:
          return EntityState.Unchanged;
      }
    }
  }
}
