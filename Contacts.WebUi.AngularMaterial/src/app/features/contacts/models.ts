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

export type ContactSortBy = 'name' | 'email' | 'phone';
