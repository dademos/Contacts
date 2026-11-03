namespace Contacts.Common.Exceptions
{
    /// <summary>
    /// When thrown it results in API returning HTTP status code 404 (not found)
    /// and ProblemDetails.Detail assigned from the exception Detail.
    /// </summary>
    public class NotFoundException : MessageException
    {
        public NotFoundException(string message, string detail)
            : base(message, detail, 404)
        {
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public NotFoundException(string detailAndMessage)
            : base(detailAndMessage, 404)
        {
        }

        public NotFoundException(Exception inner, string message, string detail)
            : base(inner, message, detail, 404)
        {
        }

        /// <summary>
        ///  Use when exception message is safe to show to the end user
        /// </summary>
        public NotFoundException(Exception inner, string detailAndMessage)
            : base(inner, detailAndMessage, 404)
        {
        }
    }
}
