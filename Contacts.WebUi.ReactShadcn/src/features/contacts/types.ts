export type ContactRequest = {
  id?: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type ContactResponse = ContactRequest & {
  id: number;
  fullName: string;
};

export const ContactSortBy = {
  name: 'name',
  email: 'email',
  phone: 'phone',
} as const;

export type ContactSortBy = (typeof ContactSortBy)[keyof typeof ContactSortBy];
