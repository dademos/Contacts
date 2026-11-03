namespace Contacts.Data.Entities
{
    public class Contact
    {
        public long Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }

        public string FullName => LastName == null 
            ? FirstName
            : FirstName + " " + LastName;
    }
}
