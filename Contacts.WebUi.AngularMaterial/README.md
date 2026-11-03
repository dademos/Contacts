# Angular frontend for Contacts Demo app

This frontend is built with Angular Material - a corporate classic (although not my personal favorite).
Implementation takes advantage of Angular evolution and uses modern approach of standalone components with signals, 
including signal based forms.

## Some points of interest

### ApiService

[`ApiService`](./src/app/common/services/api.service.ts) is a wrapper around Angular HttpClient which allows consumers
to optionally:
- specify whether they want to show success and/or error toasts (by default error toasts are shown, but success toasts are not)
- customise both types of messages for any request
- choose to show error messages from the web API
- add additional HTTP headers to any request (e.g. when calling 3rd party APIs)
- pass a UI layer loading signal which the service will automatically trigger on before sending a request and off
when request completes (or fails)

Angular `httpResource` is not used in this app, though [`ContactList`](./src/app/features/contacts/components/contact-list/contact-list.ts) 
component shows how `rxResource` can be used for reads with the `ApiService`.

### TextFilter

[`TextFilter`](./src/app/common/components/text-filter/text-filter.ts) is a customisable search input component which:
- uses adjustable debounce to avoid sending too many requests to the backend
- allows to specify a minimum length for the search term
- has a `Clear` button which removes the filter and bypasses debounce
- also bypasses debounce when the user hits Enter key

There are some meaningful unit tests for both `ApiService` and `TextFilter`.
