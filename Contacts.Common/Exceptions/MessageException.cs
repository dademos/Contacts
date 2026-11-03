namespace Contacts.Common.Exceptions
{
    /// <summary>
    /// As it's a bad practice to expose all exception messages to the end user, this exception provides a separate
    /// user-friendly message that will be included in API error response as ProblemDetails.Detail
    /// and may be shown to the end user by frontend.
    /// </summary>
    public class MessageException : StatusException
    {
        // The end user message that will be included in API error response as ProblemDetails.Detail
        public string Detail { get; protected set; }

        public MessageException(string message, string detail, int statusCode = 500)
            : base(message, statusCode)
        {
            Detail = detail;
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public MessageException(string detailAndMessage, int statusCode = 500)
            : base(detailAndMessage, statusCode)
        {
            Detail = detailAndMessage;
        }

        public MessageException(Exception inner, string message, string detail, int statusCode = 500)
            : base(inner, message, statusCode)
        {
            Detail = detail;
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public MessageException(Exception inner, string detailAndMessage, int statusCode = 500)
            : base(inner, detailAndMessage, statusCode)
        {
            Detail = detailAndMessage;
        }
    }
}
