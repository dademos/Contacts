namespace Contacts.Common.Models
{
    public record PageResult<T>(int TotalCount, IEnumerable<T> Items);
}