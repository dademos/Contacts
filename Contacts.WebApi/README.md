# Backend for the Contacts Demo app

## Application structure

The backend is built using ASP.NET Web API v10 backed up by an MS SQL (Azure) database with Entity Framework
code first migrations.

It's structured as a classic tiered clean architecture with separate projects for the lean controller 
based Web API, service layer, and DB repositories.
There's a separate project for the service contracts, as from experience in big solutions such separation
sometimes helps to avoid circular dependencies.

## API endpoint structure

The API endpoint structure is of pragmatic internal type in a sense that it doesn't strive to stricly adhere 
to all REST conventions (in contrast to a public API, that should). It does so for the 
convencence of both frontend and backend developers. Specifically this API:
- Only uses 200 success status code. No 201 for created or 204 for no content, etc. - have you ever seen 
a SPA that checked those specifically? I haven't.
- Doesn't return location headers for created resources.
- There's no `id` in update PUT route, instead `id` is passed in request body.

## OpenAPI UI

There's an [OpenAPI UI](https://contacts-dghjcuhtaqejbnd7.australiaeast-01.azurewebsites.net/scalar/) 
for the Web API if you want to play with it and maybe try API model 
validation in action. As a side note, frontend also does client side form validation. 
Normally I wouldn't expose the OpenAPI spec for a non-public API in production, 
but I did it for the sake of this demo.

## Points of interest

As it's commonly agreed that exposing raw exception messages to API consumers is not a good idea,
this app makes use of custom exceptions like 
[`NotFoundException`](../Contacts.Common/Exceptions/NotFoundException.cs) and 
[`BadRequestException`](../Contacts.Common/Exceptions/BadRequestException.cs) 
which, in addition to the standard exception message, also provide 2 things:
- HTTP status code
- Separate message (`Detail`) for API consumers (that can optionally be the same as the exception message)

They can be thrown anywhere in the app without having to pass various failure result states up
the call stack all the way to the controllers. 
[`ExceptionHandlingMiddleware`](./Middleware/ExceptionHandlingMiddleware.cs) then uses them to contstruct
standard `ProblemDetails` responses with appropriate status codes and `Detail` messages.

