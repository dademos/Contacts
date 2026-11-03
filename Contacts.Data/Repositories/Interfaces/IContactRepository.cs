using Contacts.Common.Models;

namespace Contacts.Data.Repositories.Interfaces;

public interface IContactRepository : IRepository<Entities.Contact>
{
    Task<PageResult<Entities.Contact>> Search(SortedPageSearchRequest<ContactSortBy> request);
}
