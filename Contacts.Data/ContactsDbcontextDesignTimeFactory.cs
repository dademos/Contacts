using Contacts.Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Contacts.Data
{
    /**
     * Design time db context factory, allows using migrations in Package manager as
     * Add-Migration Initial -Project Contacts.Data -StartupProject Contacts.Data
     * Update-Database -Project Contacts.Data -StartupProject Contacts.Data
     */
    internal class ContactsDbContextDesignTimeFactory : IDesignTimeDbContextFactory<ContactsDbContext>
    {
        public ContactsDbContext CreateDbContext(string[] args)
        {
            var cs = args.FirstOrDefault();
            return !cs.IsNullOrWhiteSpace()
                ? CreateWithConnectionString(cs!) // CLI argument (e.g. efbundle in pipeline)
                : CreateFromLocalConfig(); // Local dev migrations in Package Manager
        }

        private static ContactsDbContext CreateWithConnectionString(string cs)
        {
            var options = new DbContextOptionsBuilder<ContactsDbContext>()
                .UseSqlServer(cs)
                .Options;

            return new ContactsDbContext(options);
        }

        private static ContactsDbContext CreateFromLocalConfig()
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            var config = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Contacts.WebApi"))
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{environment}.json")
                .AddEnvironmentVariables()
                .Build();

            const string csName = nameof(ContactsDbContext);
            var cs = config.GetConnectionString(csName) ?? throw new Exception($"Connection string {csName} not found");
            return CreateWithConnectionString(cs);
        }
    }
}
