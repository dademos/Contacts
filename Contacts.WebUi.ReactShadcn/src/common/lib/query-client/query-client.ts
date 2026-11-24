import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toastService } from '#/common/lib/toast-service';
import type { NotifyOptions } from './notify-options';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_0000,
      retry: false,
    },
  },

  queryCache: new QueryCache({
    onSuccess: (_data, query) => {
      notifySuccess({ ...defaultOptions, ...query.meta?.notify });
    },
    onError: (error, query) => {
      notifyError(error, { ...defaultOptions, ...query.meta?.notify });
    },
  }),

  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      // Automatically invalidate queries with the same key as mutation
      queryClient.invalidateQueries({
        queryKey: mutation.options.mutationKey,
      });

      notifySuccess({ ...defaultOptions, ...mutation.meta?.notify });
    },
    onError: (error, _variables, _context, mutation) => {
      notifyError(error, { ...defaultOptions, ...mutation.meta?.notify });
    },
  }),
});

const defaultOptions: NotifyOptions = {
  showSuccess: false,
  successMessage: 'Your request has been processed successfully.',
  showError: true,
} as const;

function notifySuccess(options: NotifyOptions) {
  if (options.showSuccess) {
    toastService.success(options.successMessage!);
  }
}

function notifyError(error: Error, options: NotifyOptions) {
  if (!options.showError || axios.isCancel(error)) {
    return;
  }

  let message = options.errorMessage;

  if (axios.isAxiosError(error)) {
    const response = error.response;

    if (!response) {
      // Likely a client-side or network error
      message = error.message;

      if (!navigator.onLine) {
        message += '. You might have lost internet connectivity.';
      }
    } else {
      // API returned an unsuccessful response code
      const data = response?.data;

      if (response.status === 400 && data?.errors) {
        // ASP.Net model validation error(s) - show the first error.
        // Ideally we should have frontend validation equivalent to backend,
        // so we should never get here, but just in case frontend missed some validation.
        message = Object.values(
          data.errors as Record<string, string[]>,
        )[0]?.[0];
      } else if (data?.detail && !message) {
        // Use API error message, if present, only if client side error message was not provided
        // Our API uses standard problem details response structure
        // https://www.rfc-editor.org/rfc/rfc9457.html#name-detail
        message = data.detail;
      }
    }
  }

  toastService.error(message ?? 'There was an error processing your request.');
}
