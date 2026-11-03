using System.ComponentModel.DataAnnotations;

namespace Contacts.Common.Models;

public record SortedPageSearchRequest<TEnum> : SortedPageRequest<TEnum> where TEnum : struct, Enum
{
    [MinLength(3, ErrorMessage = "The field SearchTerm must be at least 3 characters.")]
    public string? SearchTerm { get; init; }
}