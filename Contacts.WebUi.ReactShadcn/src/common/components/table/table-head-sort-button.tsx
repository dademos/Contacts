import type {
  CellData,
  Column,
  Column_RowSorting,
  RowData,
  TableFeatures,
} from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

import { Button } from '#/common/components/ui/button';

type TableHeadSortButtonProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> = {
  column: Column<TFeatures, TData, TValue> &
    Column_RowSorting<TFeatures, TData>;
};

export function TableHeadSortButton<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>({ column }: TableHeadSortButtonProps<TFeatures, TData, TValue>) {
  const sortDirection = column.getIsSorted();

  return (
    <Button
      type="button"
      variant="ghost"
      // Account for px-2 in the parent TableHead
      className="-mx-2 w-[calc(100%+var(--spacing)*4)] justify-start"
      onClick={column.getToggleSortingHandler()}
    >
      {column.columnDef.header!.toString()}
      {sortDirection === 'asc' ? (
        <ArrowUpIcon />
      ) : sortDirection === 'desc' ? (
        <ArrowDownIcon />
      ) : (
        <ArrowUpIcon className="text-muted-foreground opacity-0 transition-opacity group-hover/button:opacity-100 group-focus-visible/button:opacity-100" />
      )}
    </Button>
  );
}
