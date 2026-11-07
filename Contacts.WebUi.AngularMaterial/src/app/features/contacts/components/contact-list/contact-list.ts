import { Component, signal, inject, effect } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort, SortDirection } from '@angular/material/sort';
import { ContactResponse, ContactSortBy } from '../../models';
import { NotificationService } from '../../../../common/services/notification.service';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ContactService } from '../../contact.service';
import { SortedPageSearchRequest } from '../../../../common/models/paging';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogWidth } from '../../../../common/models/dialog-width.enum';
import { ContactEdit } from '../contact-edit/contact-edit';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TextFilter } from '../../../../common/components/text-filter/text-filter';

@Component({
  imports: [
    MatTableModule,
    MatSort,
    MatSortHeader,
    MatPaginator,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MatProgressBar,
    TextFilter,
  ],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList {
  private readonly _notificationService = inject(NotificationService);
  private readonly _contactService = inject(ContactService);
  private readonly _dialog = inject(MatDialog);

  readonly displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  readonly searchTerm = signal<string | null>(null);
  readonly sortBy = signal<ContactSortBy>('name');
  readonly sortDirection = signal<SortDirection>('asc');
  readonly pageSize = signal(15);
  readonly pageIndex = signal(0);
  readonly mutationLoading = signal(false);

  readonly contactsResource = rxResource({
    params: (): SortedPageSearchRequest<ContactSortBy> => ({
      searchTerm: this.searchTerm(),
      sortBy: this.sortBy(),
      sortAsc: this.sortDirection() === 'asc',
      pageSize: this.pageSize(),
      pageIndex: this.pageIndex(),
    }),
    stream: ({ params }) => this._contactService.search(params),
  });

  readonly contacts = signal<ContactResponse[]>([]);
  readonly totalCount = signal(0);

  constructor() {
    // This effect prevents table rows from disappearing while paginating or sorting (i.e. while resource is loading)
    effect(() => {
      if (this.contactsResource.hasValue()) {
        this.contacts.set(this.contactsResource.value().items);
        this.totalCount.set(this.contactsResource.value().totalCount);
      }
    });
  }

  trackById = (index: number, contact: ContactResponse) => contact.id;

  onSearch(term: string | null) {
    this.searchTerm.set(term);
    this.pageIndex.set(0);
  }

  onGenerate() {
    this._contactService
      .generate(this.mutationLoading)
      .subscribe(() => this.contactsResource.reload());
  }

  onCreate() {
    this.openDialog();
  }

  onEdit(contact: ContactResponse) {
    this.openDialog(contact);
  }

  private openDialog(contact: ContactResponse | null = null) {
    this._dialog
      .open(ContactEdit, {
        width: DialogWidth.md,
        data: contact,
      })
      .afterClosed()
      .subscribe((result: ContactResponse | null) => {
        if (result) {
          this.contactsResource.reload();
        }
      });
  }

  onDelete(contact: ContactResponse) {
    this._notificationService
      .ifConfirmed({
        message: 'Are you sure you want to delete this contact?',
        details: 'This cannot be undone.',
        yesDanger: true,
      })
      .subscribe(() =>
        this._contactService
          .delete(contact.id, this.mutationLoading)
          .subscribe(() => this.contactsResource.reload()),
      );
  }

  onSort(sort: Sort) {
    this.pageIndex.set(0);
    this.sortBy.set(sort.active as ContactSortBy);
    this.sortDirection.set(sort.direction);
  }

  onPage(e: PageEvent) {
    this.pageSize.set(e.pageSize);
    this.pageIndex.set(e.pageIndex);
  }
}
