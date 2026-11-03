using System.Linq.Expressions;
using Contacts.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Contacts.Data.Repositories
{
    public class Repository<TContext, TEntity>(TContext context) : IRepository<TEntity>
        where TEntity : class
        where TContext : DbContext
    {
        protected TContext Context { get; } = context;

        public Task<IDbContextTransaction> BeginTransactionAsync() => Context.Database.BeginTransactionAsync();


        protected IQueryable<TEntity> Query(bool asNoTracking = true)
        {
            return asNoTracking ? Context.Set<TEntity>().AsNoTracking() : Context.Set<TEntity>();
        }

        public virtual void Add(TEntity entity)
        {
            Context.Set<TEntity>().Add(entity);
        }

        public void AddRange(IEnumerable<TEntity> entities)
        {
            Context.Set<TEntity>().AddRange(entities);
        }

        public virtual void Update(TEntity entity)
        {
            Context.Set<TEntity>().Update(entity);
        }

        public virtual void UpdatePart(TEntity entity, params Expression<Func<TEntity, object>>[] props)
        {
            var entry = Context.Entry(entity);
            entry.State = EntityState.Unchanged;
            foreach (var p in props)
            {
                entry.Property(p).IsModified = true;
            }
        }

        public virtual void Delete(TEntity entity)
        {
            Context.Set<TEntity>().Remove(entity);
        }

        public virtual void DeleteRange(IEnumerable<TEntity> entities)
        {
            Context.Set<TEntity>().RemoveRange(entities);
        }

        public virtual async Task<ICollection<TEntity>> GetAllAsync(bool asNoTracking = true)
        {
            return await Query(asNoTracking).ToListAsync();
        }

        public virtual async Task<TEntity?> FindAsync(params object[] keyValues)
        {
            return await Context.Set<TEntity>().FindAsync(keyValues);
        }

        public virtual async Task<TEntity?> GetSingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes)
        {
            return await Query(asNoTracking).WithIncludes(includes).SingleOrDefaultAsync(predicate);
        }

        public virtual async Task<TEntity> GetSingleAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes)
        {
            return await Query(asNoTracking).WithIncludes(includes).SingleAsync(predicate);
        }

        public virtual async Task<TEntity?> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes)
        {
            return await Query(asNoTracking).WithIncludes(includes).FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<TEntity> GetFirstAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes)
        {
            return await Query(asNoTracking).WithIncludes(includes).FirstAsync(predicate);
        }

        public virtual async Task<ICollection<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes)
        {
            return await Query(asNoTracking).WithIncludes(includes).Where(predicate).ToListAsync();
        }

        public virtual Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return Query().AnyAsync(predicate);
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            return await Context.SaveChangesAsync();
        }
    }
}
