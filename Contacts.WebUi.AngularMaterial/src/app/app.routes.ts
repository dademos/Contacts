import { Routes } from '@angular/router';
import { AboutPage } from './features/about/components/about-page/about-page';

const appName = 'Contacts Demo';

export const routes: Routes = [
  {
    path: '',
    component: AboutPage,
    title: `About | ${appName}`,
  },
  {
    path: 'contacts',
    loadComponent: () => import('./features/contacts/components/contacts-page/contacts-page'),
    title: `Contacts | ${appName}`,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
