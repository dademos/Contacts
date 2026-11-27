import { Dialog } from '@base-ui/react/dialog';
import type { ContactResponse } from '#/features/contacts/types';

export const contactEditDialogHandle =
  Dialog.createHandle<ContactResponse | null>();
