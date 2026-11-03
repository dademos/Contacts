using Contacts.Services.Contracts.Interfaces;
using Contacts.Services.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Contacts.Services
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IContactService, ContactService>();

            return services;
        }
    }
}
