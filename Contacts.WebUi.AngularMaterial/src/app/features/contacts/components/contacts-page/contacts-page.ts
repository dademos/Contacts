import { Component } from '@angular/core';
import { ContactList } from '../contact-list/contact-list';
import { ContactService } from '../../contact.service';

@Component({
  imports: [ContactList],
  selector: 'app-contacts-page',
  providers: [ContactService],
  styleUrl: './contacts-page.scss',
  templateUrl: './contacts-page.html',
})
export default class ContactsPage {}
