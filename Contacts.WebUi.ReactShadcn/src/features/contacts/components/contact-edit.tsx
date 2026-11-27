import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { DialogCloseButton } from '#/common/components/dialog-close-button';
import { SubmitButton } from '#/common/components/form/submit-button';
import { useAppForm } from '#/common/components/form/use-app-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/common/components/ui/dialog';
import { contactEditDialogHandle } from '#/features/contacts/components/contact-edit-dialog-handle';
import { contactsApi } from '#/features/contacts/lib/contacts-api';
import type {
  ContactRequest,
  ContactResponse,
} from '#/features/contacts/types';

const contactSchema = z
  .object({
    firstName: z
      .string()
      .max(50, 'Must not exceed 50 chars')
      .refine((value) => !!value.trim(), 'First name is required'),
    lastName: z.string().max(50, 'Must not exceed 50 chars'),
    email: z
      .string()
      .max(254, 'Must not exceed 254 chars')
      .refine(
        (value) => !value.trim() || z.email().safeParse(value.trim()).success,
        'Enter a valid email address',
      ),
    phone: z
      .string()
      .max(10, 'Must be 10 digits')
      .refine(
        (value) => !value.trim() || /^04\d{8}$/.test(value.trim()),
        'Must be 10 digits and start with 04',
      ),
  })
  .superRefine(({ email, phone }, context) => {
    if (!email.trim() && !phone.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Either email or phone must be provided',
      });
    }
  });

export function ContactEdit() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog handle={contactEditDialogHandle} onOpenChange={setOpen}>
      {({ payload }) => (
        <ContactEditDialogContent contact={payload ?? null} open={open} />
      )}
    </Dialog>
  );
}

function ContactEditDialogContent({
  contact,
  open,
}: {
  contact: ContactResponse | null;
  open: boolean;
}) {
  const createMutation = useMutation(contactsApi.create());
  const updateMutation = useMutation(contactsApi.update());

  const form = useAppForm({
    defaultValues: {
      firstName: contact?.firstName ?? '',
      lastName: contact?.lastName ?? '',
      email: contact?.email ?? '',
      phone: contact?.phone ?? '',
    },
    validators: {
      onChange: contactSchema,
    },
    onSubmit: async ({ value }) => {
      const request: ContactRequest = {
        id: contact?.id,
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim() || undefined,
        email: value.email.trim() || undefined,
        phone: value.phone.trim() || undefined,
      };

      if (contact) {
        await updateMutation.mutateAsync(request);
      } else {
        await createMutation.mutateAsync(request);
      }

      contactEditDialogHandle.close();
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: contact?.firstName ?? '',
        lastName: contact?.lastName ?? '',
        email: contact?.email ?? '',
        phone: contact?.phone ?? '',
      });
    }
  }, [open, contact, form.reset]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {contact ? 'Edit contact' : 'Add new contact'}
        </DialogTitle>
      </DialogHeader>

      <form
        noValidate
        id={form.formId}
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.AppField name="firstName">
          {(field) => (
            <field.TextField label="First name" maxLength={50} required />
          )}
        </form.AppField>
        <form.AppField name="lastName">
          {(field) => <field.TextField label="Last name" maxLength={50} />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              maxLength={254}
              description="Either email or phone must be provided"
            />
          )}
        </form.AppField>
        <form.AppField name="phone">
          {(field) => (
            <field.TextField label="Mobile phone" type="tel" maxLength={10} />
          )}
        </form.AppField>
      </form>

      <DialogFooter>
        <DialogCloseButton />

        <SubmitButton formApi={form} />
      </DialogFooter>
    </DialogContent>
  );
}
