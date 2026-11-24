import { toast } from '#/common/components/ui/toast';

export const toastService = {
  success(message: string, timeout: number = 4000) {
    toast.add({
      type: 'success',
      description: message,
      timeout,
    });
  },

  error(message: string, timeout: number = 7000) {
    toast.add({
      type: 'error',
      description: message,
      timeout,
      priority: 'high',
    });
  },
} as const;
