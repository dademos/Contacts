using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Data
{
    public static class QueryableExtensions
    {
        public static IQueryable<TEntity> WithIncludes<TEntity>(this IQueryable<TEntity> self,
            params Expression<Func<TEntity, object>>[] includes) where TEntity : class
        {
            return includes.Aggregate(self, (entity, prop) => entity.Include(prop));
        }
    }
}

