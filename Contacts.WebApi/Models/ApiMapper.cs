using Contacts.Common.Models;
using Contacts.Data.Entities;
using Contacts.WebApi.Models.Contacts;
using Riok.Mapperly.Abstractions;

namespace Contacts.WebApi.Models
{
    [Mapper]
    public partial class ApiMapper
    {
        public partial ContactResponse ToResponse(Contact contact);
        [MapperIgnoreTarget(nameof(Contact.Id))]
        public partial Contact FromAddRequest(CreateContactRequest request);
        public partial Contact FromUpdateRequest(UpdateContactRequest request);
        public partial PageResult<ContactResponse> MapPageResult(PageResult<Contact> page);
    }
}
