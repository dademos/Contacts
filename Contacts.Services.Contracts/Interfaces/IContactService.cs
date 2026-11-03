using Contacts.Data.Entities;
using Contacts.Common.Models;

namespace Contacts.Services.Contracts.Interfaces;

public interface IContactService
{
    Task<PageResult<Contact>> Search(SortedPageSearchRequest<ContactSortBy> request);
    Task<Contact> Create(Contact contact);
    Task<Contact> Update(Contact contact);
    Task Delete(long id);
    Task Seed(int count);
}
