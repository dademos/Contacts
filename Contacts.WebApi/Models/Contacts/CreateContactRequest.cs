using System.ComponentModel.DataAnnotations;

namespace Contacts.WebApi.Models.Contacts
{
    public record CreateContactRequest
    {
        [Required]
        [StringLength(50)]
        public required string FirstName { get; init; }
        [StringLength(50)]
        public string? LastName { get; init; }
        [EmailAddress]
        [StringLength(254)]
        public string? Email { get; init; }
        [RegularExpression(@"04\d{8}")]
        [StringLength(30)]
        public string? Phone { get; init; }
    }
}
