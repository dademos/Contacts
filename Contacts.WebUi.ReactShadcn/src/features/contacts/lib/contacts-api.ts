import {
  keepPreviousData,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query';
import { apiService } from '#/common/lib/api-service';
import type {
  PageResult,
  SortedPageSearchRequest,
} from '#/common/types/paging';
import type {
  ContactRequest,
  ContactResponse,
  ContactSortBy,
} from '#/features/contacts/types';

const contacts = 'Contacts';
const contactsPagesKey = [contacts, 'pages'] as const;

export const contactsApi = {
  search: (request: SortedPageSearchRequest<ContactSortBy>) =>
    queryOptions({
      queryKey: [...contactsPagesKey, request] as const,
      queryFn: ({ signal }) =>
        apiService.post<PageResult<ContactResponse>>(
          `${contacts}/Search`,
          request,
          { signal },
        ),
      placeholderData: keepPreviousData,
    }),

  create: () =>
    mutationOptions({
      mutationFn: (contact: ContactRequest) =>
        apiService.post<ContactResponse>(contacts, contact),
      mutationKey: contactsPagesKey,
      meta: {
        notify: {
          showSuccess: true,
          successMessage:
            'Contact created successfully but may not appear on the current page.',
        },
      },
    }),

  update: () =>
    mutationOptions({
      mutationFn: (contact: ContactRequest) =>
        apiService.put<ContactResponse>(contacts, contact),
      mutationKey: contactsPagesKey,
    }),

  delete: () =>
    mutationOptions({
      mutationFn: (id: number) => apiService.delete(`${contacts}/${id}`),
      mutationKey: contactsPagesKey,
    }),

  seed: () =>
    mutationOptions({
      mutationFn: () => apiService.post(`${contacts}/Seed/10`),
      mutationKey: contactsPagesKey,
    }),
} as const;
