import { createContext } from 'react';

import type { ConfirmFunction } from './confirm-dialog-types';

export const ConfirmDialogContext = createContext<ConfirmFunction | null>(null);
