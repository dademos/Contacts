# React frontend for Contacts Demo app

This frontend uses a modern approach to building React apps - headless Base UI component library with shadcn/ui.
It also uses TanStack Router, Query, Table and Form with Zod schema validation. React compiler is enabled, so
there are no `useMemo` or `useCallback` in the code.

## Some points of interest

### Success and error notifications in queryClient

TanStack [`queryClient`](./src/common/lib/query-client/query-client.ts) is extended with request success and error 
notifications with sensible defaults in a way that allows individual queries and mutations to:
- specify whether they want to show success and/or error toasts (by default error toasts are shown, but success toasts are not)
- customise both types of messages per query/mutation
- choose to show error messages from the backend (default behaviour)

All of the above can be done declaratively on query or mutation level without having to explicitly handle success/error
events in queries/mutations or components.

The only success toast in the app is shown when a new contact is created. To see an error toast try saving a contact with a 
duplicate email or phone. That will show an error message from the backend (it enforces email and phone uniqueness on DB level). 

### TextFilter

[`TextFilter`](./src/common/components/text-filter.tsx) is a customisable search input component which:
- uses adjustable debounce to avoid sending too many requests to the backend
- allows to specify a minimum length for the search term
- has a `Clear` button which removes the filter and bypasses debounce
- also bypasses debounce when the user hits Enter key

There are some meaningful unit tests for both `queryClient` and `TextFilter`.
