using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Storage;

namespace Contacts.Data.Repositories.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<IDbContextTransaction> BeginTransactionAsync();

        void Add(TEntity entity);
        void AddRange(IEnumerable<TEntity> entities);
        void Update(TEntity entity);
        void UpdatePart(TEntity entity, params Expression<Func<TEntity, object>>[] props);
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);

        Task<ICollection<TEntity>> GetAllAsync(bool asNoTracking = true);
        Task<TEntity?> FindAsync(params object[] keyValues);
        Task<TEntity?> GetSingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes);
        Task<TEntity> GetSingleAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes);
        Task<TEntity?> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes);
        Task<TEntity> GetFirstAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes);
        Task<ICollection<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, params Expression<Func<TEntity, object>>[] includes);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);
        Task<int> SaveChangesAsync();
    }
}
