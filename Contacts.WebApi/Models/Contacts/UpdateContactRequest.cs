using System.ComponentModel.DataAnnotations;

namespace Contacts.WebApi.Models.Contacts
{
    public record UpdateContactRequest : CreateContactRequest
    {
        [Range(1, long.MaxValue)]
        public long Id { get; init; }
    }
}
