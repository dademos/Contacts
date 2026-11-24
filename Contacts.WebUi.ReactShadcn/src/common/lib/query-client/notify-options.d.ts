import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      notify?: NotifyOptions;
    };

    mutationMeta: {
      notify?: NotifyOptions;
    };
  }
}

export type NotifyOptions = {
  showSuccess?: boolean;
  successMessage?: string;
  showError?: boolean;
  errorMessage?: string;
};
