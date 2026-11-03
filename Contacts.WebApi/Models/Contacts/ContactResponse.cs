namespace Contacts.WebApi.Models.Contacts
{
    public record ContactResponse
    {
        public long Id { get; set; }
        public required string FirstName { get; set; }
        public string? LastName { get; set; }
        public required string FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }

    /* This format works all the same, but results in all props marked as required in Scalar OpenApi UI,
       must be because of using init; instead of set;
    
       public record ContactResponse(
           long Id,
           string FirstName,
           string? LastName,
           string FullName,
           string? Email,
           string? Phone);
    */
}
