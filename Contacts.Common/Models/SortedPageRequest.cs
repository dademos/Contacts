using System.ComponentModel.DataAnnotations;

namespace Contacts.Common.Models;

public record SortedPageRequest<TEnum> : PageRequest where TEnum : struct, Enum
{
    [Required]
    public TEnum SortBy { get; init; }
    public bool SortAsc { get; init; }
}