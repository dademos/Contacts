import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/common/components/ui/alert-dialog';
import { ConfirmDialogContext } from './confirm-dialog-context';
import type { ConfirmFunction, ConfirmOptions } from './confirm-dialog-types';

type PendingConfirmation = {
  options: Required<ConfirmOptions>;
  resolve: (result: boolean) => void;
};

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pending, setPending] = useState<PendingConfirmation | null>(null);

  const confirm: ConfirmFunction = (options = {}) => {
    return new Promise<boolean>((resolve) => {
      const request: PendingConfirmation = {
        options: {
          title: 'Please confirm',
          message: 'Are you sure?',
          yesText: 'Yes',
          noText: 'No',
          yesVariant: 'default',
          ...options,
        },
        resolve,
      };

      setPending(request);
    });
  };

  function complete(result: boolean) {
    if (!pending) {
      return;
    }

    pending.resolve(result);
    setPending(null);
  }

  return (
    <ConfirmDialogContext value={confirm}>
      {children}

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open) {
            complete(false);
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.options.title}</AlertDialogTitle>

            <AlertDialogDescription>
              {pending?.options.message}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{pending?.options.noText}</AlertDialogCancel>

            <AlertDialogAction
              variant={pending?.options.yesVariant}
              onClick={() => complete(true)}
            >
              {pending?.options.yesText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext>
  );
}
