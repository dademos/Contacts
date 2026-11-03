using Contacts.Data.Repositories;
using Contacts.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Contacts.Data
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddDbContext(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<ContactsDbContext>(options => options.UseSqlServer(config.GetConnectionString(nameof(ContactsDbContext)),
                o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

            services.AddScoped<IContactRepository, ContactRepository>();

            return services;
        }
    }
}
