import { Component } from '@angular/core';
import { ContactList } from '../contact-list/contact-list';

@Component({
  imports: [ContactList],
  selector: 'app-contacts-page',
  styleUrl: './contacts-page.scss',
  templateUrl: './contacts-page.html',
})
export class ContactsPage {}
