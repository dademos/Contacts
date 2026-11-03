using Contacts.Data;
using Contacts.WebApi.Models;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;
using Contacts.Services;
using Contacts.WebApi.Middleware;

namespace Contacts.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services
                .AddSingleton<ApiMapper>()
                .AddDbContext(builder.Configuration)
                .AddServices()
                .ConfigureHttpJsonOptions(options =>
                {
                    // Needed for "string enums" in OpenApi schema
                    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    // Affects responses written by IProblemDetailsService in ExceptionHandlingMiddleware
                    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                })
                .AddOpenApi()
                .AddProblemDetails()
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseCors(policyBuilder => policyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            }

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // In real world it might not be a good idea to publish API schema and UI in prod,
            // but for this demo publish in all environments
            app.MapOpenApi();
            app.MapScalarApiReference();

            app.UseMiddleware<ExceptionHandlingMiddleware>();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
