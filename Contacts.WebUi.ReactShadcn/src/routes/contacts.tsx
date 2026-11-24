import { createFileRoute } from '@tanstack/react-router';
import { ContactsPage } from '#/features/contacts/components/contacts-page';

export const Route = createFileRoute('/contacts')({
  component: ContactsPage,
});
