namespace Contacts.Common.Exceptions
{
    /// <summary>
    /// When thrown it results in API returning HTTP status code 400 (bad request)
    /// and ProblemDetails.Detail assigned from the exception Detail.
    /// </summary>
    public class BadRequestException : MessageException
    {
        public BadRequestException(string message, string detail)
            : base(message, detail, 400)
        {
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public BadRequestException(string detailAndMessage)
            : base(detailAndMessage, 400)
        {
        }

        public BadRequestException(Exception inner, string message, string detail)
            : base(inner, message, detail, 400)
        {
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public BadRequestException(Exception inner, string detailAndMessage)
            : base(inner, detailAndMessage, 400)
        {
        }
    }
}
