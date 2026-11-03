using System.ComponentModel.DataAnnotations;

namespace Contacts.Common.Models
{
    public record PageRequest
    {
        [Range(1, 100)]
        public int PageSize { get; init; }
        [Range(0, int.MaxValue)]
        public int PageIndex { get; init; }
    }
}
