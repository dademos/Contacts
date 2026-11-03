import { Routes } from '@angular/router';
import { AboutPage } from './features/about/components/about-page/about-page';
import { ContactsPage } from './features/contacts/components/contacts-page/contacts-page';

const appName = 'Contacts Demo';

export const routes: Routes = [
  {
    path: '',
    component: AboutPage,
    title: `About | ${appName}`,
  },
  {
    path: 'contacts',
    component: ContactsPage,
    title: `Contacts | ${appName}`,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
