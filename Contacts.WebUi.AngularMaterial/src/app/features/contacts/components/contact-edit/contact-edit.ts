import { Component, inject, signal } from '@angular/core';
import { ContactService } from '../../contact.service';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ContactRequest, ContactResponse } from '../../models';
import { MatButton } from '@angular/material/button';
import {
  FormField,
  form,
  FormRoot,
  required,
  maxLength,
  email,
  pattern,
  validate,
} from '@angular/forms/signals';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    FormField,
    FormRoot,
    MatProgressSpinner,
  ],
  selector: 'app-contact-edit',
  styleUrl: './contact-edit.scss',
  templateUrl: './contact-edit.html',
})
export class ContactEdit {
  private readonly _contactService = inject(ContactService);
  private readonly _dialogRef = inject(MatDialogRef);

  data = inject<ContactResponse | null>(MAT_DIALOG_DATA);
  editMode = !!this.data;

  contactModel = signal<Required<ContactRequest>>({
    id: this.data?.id ?? 0,
    firstName: this.data?.firstName ?? '',
    lastName: this.data?.lastName ?? '',
    email: this.data?.email ?? '',
    phone: this.data?.phone ?? '',
  });

  contactForm = form(
    this.contactModel,
    (path) => {
      required(path.firstName, { message: 'First name is required' });
      maxLength(path.firstName, 50);

      maxLength(path.lastName, 50);

      maxLength(path.email, 254);
      email(path.email, { message: 'Enter a valid email address' });

      maxLength(path.phone, 10);
      pattern(path.phone, /^04\d{8}$/, {
        message: 'Phone must be 10 digits and start with 04',
      });
      validate(path.phone, (ctx) => {
        if (!ctx.valueOf(path.email).trim() && !ctx.value().trim()) {
          return {
            kind: 'required',
            message: 'Either email or phone must be provided',
          };
        }

        return null;
      });
    },
    {
      submission: {
        action: async (form) => {
          const response = await this.getSavePromise(form().value());
          this._dialogRef.close(response);
        },
      },
    },
  );

  getSavePromise(contact: Required<ContactRequest>): Promise<ContactResponse> {
    const request: ContactRequest = {
      id: contact.id || undefined,
      firstName: contact.firstName.trim(),
      lastName: contact.lastName.trim() || undefined,
      email: contact.email.trim() || undefined,
      phone: contact.phone.trim() || undefined,
    };

    return firstValueFrom(
      this.editMode ? this._contactService.update(request) : this._contactService.create(request),
    );
  }
}
