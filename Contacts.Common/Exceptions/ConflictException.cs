namespace Contacts.Common.Exceptions
{
    /// <summary>
    /// When thrown it results in API returning HTTP status code 409 (conflict)
    /// and ProblemDetails.Detail assigned from the exception Detail.
    /// </summary>
    public class ConflictException : MessageException
    {
        public ConflictException(string message, string detail)
            : base(message, detail, 409)
        {
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public ConflictException(string detailAndMessage)
            : base(detailAndMessage, 409)
        {
        }

        public ConflictException(Exception inner, string message, string detail)
            : base(inner, message, detail, 409)
        {
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public ConflictException(Exception inner, string detailAndMessage)
            : base(inner, detailAndMessage, 409)
        {
        }
    }
}
