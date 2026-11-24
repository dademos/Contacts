import { useContext } from 'react';
import { ConfirmDialogContext } from './confirm-dialog-context';

export function useConfirm() {
  const value = useContext(ConfirmDialogContext);

  if (!value) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  }

  return value;
}
