import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  type PaginationState,
  rowPaginationFeature,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  type Updater,
  useTable,
} from '@tanstack/react-table';
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools';
import {
  PencilIcon,
  RefreshCwIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Paginator } from '#/common/components/table/paginator';
import { TableHeadSortButton } from '#/common/components/table/table-head-sort-button';
import { getAriaSort } from '#/common/components/table/utils';
import { TextFilter } from '#/common/components/text-filter';
import { Button } from '#/common/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/common/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/common/components/ui/tooltip';
import { useConfirm } from '#/common/providers/confirm-dialog/use-confirm-dialog';
import type { SortedPageSearchRequest } from '#/common/types/paging';
import { ContactEdit } from '#/features/contacts/components/contact-edit';
import { contactsApi } from '#/features/contacts/lib/contacts-api';
import { type ContactResponse, ContactSortBy } from '#/features/contacts/types';

const contactTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
});

const columnHelper = createColumnHelper<
  typeof contactTableFeatures,
  ContactResponse
>();

export function ContactList() {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: ContactSortBy.name, desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<ContactResponse | null>(
    null,
  );
  const confirm = useConfirm();

  const request: SortedPageSearchRequest<ContactSortBy> = {
    searchTerm,
    sortBy: sorting[0].id as ContactSortBy,
    sortAsc: !sorting[0].desc,
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
  };
  const contactsQuery = useQuery(contactsApi.search(request));
  const contacts = contactsQuery.data?.items ?? [];
  const totalCount = contactsQuery.data?.totalCount ?? 0;

  const seedMutation = useMutation(contactsApi.seed());
  const deleteMutation = useMutation(contactsApi.delete());
  const isMutating = seedMutation.isPending || deleteMutation.isPending;

  function onSearch(value: string | null) {
    setSearchTerm(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function onSortChange(updater: Updater<SortingState>) {
    setSorting(updater);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function onGenerate() {
    seedMutation.mutate();
  }

  async function onDelete(contact: ContactResponse) {
    if (
      await confirm({
        message: `Are you sure you want to delete ${contact.fullName}?`,
        yesVariant: 'destructive',
      })
    ) {
      deleteMutation.mutate(contact.id);
    }
  }

  function onCreate() {
    setContactToEdit(null);
    setEditDialogOpen(true);
  }

  function onEdit(contact: ContactResponse) {
    setContactToEdit(contact);
    setEditDialogOpen(true);
  }

  const columns = columnHelper.columns([
    columnHelper.accessor('fullName', {
      id: ContactSortBy.name,
      header: 'Name',
    }),
    columnHelper.accessor('email', {
      id: ContactSortBy.email,
      header: 'Email',
      cell: ({ row }) =>
        row.original.email ? (
          <a className="link" href={`mailto:${row.original.email}`}>
            {row.original.email}
          </a>
        ) : null,
    }),
    columnHelper.accessor('phone', {
      id: ContactSortBy.phone,
      header: 'Phone',
      cell: ({ row }) =>
        row.original.phone ? (
          <a className="link" href={`tel:${row.original.phone}`}>
            {row.original.phone}
          </a>
        ) : null,
    }),
    columnHelper.display({
      id: 'actions',
      enableSorting: false,
      header: () => (
        <div className="flex justify-end gap-1">
          <span className="sr-only">Actions</span>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Add new contact"
                  disabled={isMutating}
                  onClick={onCreate}
                >
                  <UserPlusIcon />
                </Button>
              }
            />
            <TooltipContent>Add new contact</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Generate 10 contacts"
                  disabled={isMutating}
                  onClick={onGenerate}
                >
                  {seedMutation.isPending ? (
                    <RefreshCwIcon className="animate-spin" />
                  ) : (
                    <UsersIcon />
                  )}
                </Button>
              }
            />
            <TooltipContent>
              Generate 10 contacts for demo purposes
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${row.original.fullName}`}
                  disabled={isMutating}
                  onClick={() => onEdit(row.original)}
                >
                  <PencilIcon />
                </Button>
              }
            />
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${row.original.fullName}`}
                  disabled={isMutating}
                  onClick={() => void onDelete(row.original)}
                >
                  <TrashIcon />
                </Button>
              }
            />
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      ),
    }),
  ]);

  const table = useTable({
    features: contactTableFeatures,
    columns,
    data: contacts,
    state: { sorting, pagination },
    rowCount: totalCount,
    onSortingChange: onSortChange,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
    enableSortingRemoval: false,
    getRowId: (contact) => String(contact.id),
    key: 'contacts-table',
  });

  useTanStackTableDevtools(table);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 p-2">
        <TextFilter label="Search (starts with)" onValueChange={onSearch} />
        {contactsQuery.isFetching && (
          <>
            <RefreshCwIcon
              aria-hidden="true"
              size="20"
              className="animate-spin"
            />
            <span role="status" className="sr-only">
              Loading contacts...
            </span>
          </>
        )}
      </div>

      <Table>
        <TableCaption className="sr-only">Contacts</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  scope="col"
                  aria-sort={getAriaSort(header.column)}
                  colSpan={header.colSpan}
                  className={
                    header.column.columnDef.id === 'actions'
                      ? 'w-22'
                      : undefined
                  }
                  aria-label={
                    header.column.columnDef.id === 'actions'
                      ? 'Actions'
                      : undefined
                  }
                >
                  {header.column.getCanSort() ? (
                    <TableHeadSortButton column={header.column} />
                  ) : (
                    table.FlexRender({ header })
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  {table.FlexRender({ cell })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {table.getRowModel().rows.length === 0 && (
        <div className="h-24 flex justify-center items-center">
          {contactsQuery.isError
            ? 'Failed to load contacts.'
            : contactsQuery.isLoading
              ? 'Loading contacts...'
              : searchTerm
                ? 'No contacts match your search term.'
                : 'No contacts found.'}
        </div>
      )}

      {(table.getRowModel().rows.length > 0 || table.getCanPreviousPage()) && (
        <Paginator table={table} />
      )}

      <ContactEdit
        contact={contactToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
