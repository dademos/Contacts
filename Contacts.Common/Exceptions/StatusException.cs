using System.Net;

namespace Contacts.Common.Exceptions
{
    /// <summary>
    /// Provides HTTP status code that will be assigned to API response
    /// </summary>
    public class StatusException : Exception
    {
        public int StatusCode { get; protected set; }

        public StatusException(string message, int statusCode = 500)
            : base(message)
        {
            StatusCode = statusCode;
        }

        public StatusException(Exception inner, string message, int statusCode = 500)
            : base(message, inner)
        {
            StatusCode = statusCode;
        }
    }
}
