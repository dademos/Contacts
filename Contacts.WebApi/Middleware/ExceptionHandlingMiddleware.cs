using Contacts.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Contacts.WebApi.Middleware
{
    internal class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly ILogger _logger;
        private readonly IProblemDetailsService _problemDetailsService;

        public ExceptionHandlingMiddleware(RequestDelegate next,
            IHostEnvironment hostEnvironment,
            ILogger<ExceptionHandlingMiddleware> logger,
            IProblemDetailsService problemDetailsService)
        {
            _next = next;
            _hostEnvironment = hostEnvironment;
            _logger = logger;
            _problemDetailsService = problemDetailsService;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception e)
            {
                await HandleException(context, e);
            }
        }

        private async Task HandleException(HttpContext context, Exception e)
        {
            var code = e is StatusException sEx ? sEx.StatusCode : 500;

            _logger.Log(code >= 500 ? LogLevel.Error : LogLevel.Warning, e, $"Exception: {e.Message}");

            if (context.Response.HasStarted)
            {
                _logger.LogWarning("Not writing error response because response already started");
                return;
            }

            context.Response.StatusCode = code;

            var detail = e is MessageException mEx
                ? mEx.Detail 
                : "There was an error processing your request.";

            await _problemDetailsService.WriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = new ProblemDetailsResponse
                {
                    // ProblemDetailsService will populate Type and Title based on Status and add a TraceId
                    Status = code,
                    Detail = detail, // https://www.rfc-editor.org/rfc/rfc9457.html#name-detail
                    Exception = _hostEnvironment.IsDevelopment() ? e.ToString() : null
                },
            });
        }

        private class ProblemDetailsResponse : ProblemDetails
        {
            public string? Exception { get; set; }
        }
    }
}
