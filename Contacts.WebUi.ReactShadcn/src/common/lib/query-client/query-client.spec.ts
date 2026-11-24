import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toastService } from '#/common/lib/toast-service';
import { queryClient } from './query-client';

describe('queryClient', () => {
  beforeEach(() => {
    vi.spyOn(toastService, 'success').mockImplementation(() => {});
    vi.spyOn(toastService, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  function axiosError(
    status: number,
    data: unknown,
  ): AxiosError<{ detail?: string; errors?: Record<string, string[]> }> {
    const response: AxiosResponse = {
      data,
      status,
      statusText: status === 400 ? 'Bad Request' : 'Internal Server Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
    };

    return new AxiosError(
      'Request failed',
      undefined,
      undefined,
      undefined,
      response,
    );
  }

  describe('success notifications', () => {
    it.each([
      {
        description: 'provided success message',
        notify: {
          showSuccess: true,
          successMessage: 'Custom success message',
        },
        expectedMessage: 'Custom success message',
      },
      {
        description: 'default success message',
        notify: { showSuccess: true },
        expectedMessage: 'Your request has been processed successfully.',
      },
    ])(
      'shows $description when enabled',
      async ({ notify, expectedMessage }) => {
        const mutation = queryClient.getMutationCache().build(queryClient, {
          mutationFn: async () => ({ ok: true }),
          meta: { notify },
        });

        await mutation.execute(undefined);

        expect(toastService.success).toHaveBeenCalledExactlyOnceWith(
          expectedMessage,
        );
      },
    );

    it('doesn`t show success notification by default', async () => {
      const mutation = queryClient.getMutationCache().build(queryClient, {
        mutationFn: async () => ({ ok: true }),
      });

      await mutation.execute(undefined);

      expect(toastService.success).not.toHaveBeenCalled();
    });
  });

  describe('error notifications', () => {
    it('shows the first API validation error for status 400', async () => {
      const error = axiosError(400, {
        errors: {
          Name: ['Name is required', 'Name must be at least 3 characters'],
          Email: ['Invalid email address'],
        },
      });

      await expect(
        queryClient.query({
          queryKey: ['validation-error'],
          queryFn: () => Promise.reject(error),
          retry: false,
        }),
      ).rejects.toBe(error);

      expect(toastService.error).toHaveBeenCalledExactlyOnceWith(
        'Name is required',
      );
    });

    it.each([
      {
        description: 'response detail when no custom message is provided',
        notify: undefined,
        expectedMessage: 'API error detail',
      },
      {
        description: 'provided custom error message',
        notify: { errorMessage: 'Custom error message' },
        expectedMessage: 'Custom error message',
      },
    ])('shows $description', async ({ notify, expectedMessage }) => {
      const error = axiosError(500, { detail: 'API error detail' });

      await expect(
        queryClient.query({
          queryKey: ['server-error'],
          queryFn: () => Promise.reject(error),
          retry: false,
          meta: notify ? { notify } : undefined,
        }),
      ).rejects.toBe(error);

      expect(toastService.error).toHaveBeenCalledExactlyOnceWith(
        expectedMessage,
      );
    });

    it('shows only one error notification when retry is enabled', async () => {
      const error = axiosError(500, { detail: 'API error detail' });
      const queryFn = vi.fn(() => Promise.reject(error));

      await expect(
        queryClient.query({
          queryKey: ['retry-error'],
          queryFn,
          retry: 2,
          retryDelay: 0,
        }),
      ).rejects.toBe(error);

      expect(queryFn).toHaveBeenCalledTimes(3);
      expect(toastService.error).toHaveBeenCalledExactlyOnceWith(
        'API error detail',
      );
    });

    it('doesn`t show error notification when disabled', async () => {
      const error = axiosError(500, { detail: 'API error detail' });

      await expect(
        queryClient.query({
          queryKey: ['silent-error'],
          queryFn: () => Promise.reject(error),
          retry: false,
          meta: { notify: { showError: false } },
        }),
      ).rejects.toBe(error);

      expect(toastService.error).not.toHaveBeenCalled();
    });
  });

  it('invalidates queries with the mutation key and shows its success notification', async () => {
    const queryKey = ['contacts', 'page'];
    const mutationKey = ['contacts'];

    await queryClient.query({
      queryKey,
      queryFn: async () => [],
      staleTime: Infinity,
    });

    const query = queryClient.getQueryCache().find({ queryKey });
    expect(query?.state.isInvalidated).toBe(false);

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationKey,
      mutationFn: async () => ({ ok: true }),
      meta: {
        notify: {
          showSuccess: true,
          successMessage: 'Contact saved',
        },
      },
    });

    await mutation.execute(undefined);

    expect(query?.state.isInvalidated).toBe(true);
    expect(toastService.success).toHaveBeenCalledExactlyOnceWith(
      'Contact saved',
    );
  });
});
