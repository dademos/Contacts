using Contacts.Common.Extensions;
using Contacts.Common.Models;
using Contacts.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Data.Repositories
{
    internal class ContactRepository(ContactsDbContext context)
        : Repository<ContactsDbContext, Entities.Contact>(context), IContactRepository
    {
        public async Task<PageResult<Entities.Contact>> Search(SortedPageSearchRequest<ContactSortBy> request)
        {
            if (request.PageSize < 1)
            {
                throw new ArgumentException($"{nameof(request.PageSize)} must be positive");
            }

            if (request.PageIndex < 0)
            {
                throw new ArgumentException($"{nameof(request.PageIndex)} must be non-negative");
            }

            var query = Context.Contacts.AsNoTracking();

            if (!request.SearchTerm.IsNullOrWhiteSpace())
            {
                query = query.Where(c =>
                    (c.FirstName + (c.LastName == null ? "" : " " + c.LastName)).StartsWith(request.SearchTerm!)
                    || (c.Email != null && c.Email.StartsWith(request.SearchTerm!))
                    || (c.Phone != null && c.Phone.StartsWith(request.SearchTerm!))
                );
            }

            query = request.SortBy switch
            {
                ContactSortBy.Email => request.SortAsc
                    ? query.OrderBy(c => c.Email)
                    : query.OrderByDescending(c => c.Email),
                ContactSortBy.Phone => request.SortAsc
                    ? query.OrderBy(c => c.Phone)
                    : query.OrderByDescending(c => c.Phone),
                _ => request.SortAsc
                    ? query.OrderBy(c => c.FirstName).ThenBy(c => c.LastName)
                    : query.OrderByDescending(c => c.FirstName).ThenByDescending(c => c.LastName)
            };

            var page = new PageResult<Entities.Contact>(
                TotalCount: await query.CountAsync(),
                Items: await query
                    .Skip(request.PageIndex * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync());

            return page;
        }
    }
}
