import type {
  PaginationState,
  ReactTable,
  RowData,
  Table_RowPagination,
  TableFeatures,
} from '@tanstack/react-table';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { useId } from 'react';

import { Button } from '#/common/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/common/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/common/components/ui/tooltip';

const defaultPageSizes = [10, 15, 20, 25, 30, 50];

type PaginatorProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected extends { pagination: PaginationState },
> = {
  table: ReactTable<TFeatures, TData, TSelected> &
    Table_RowPagination<TFeatures, TData>;
  pageSizes?: number[];
};

export function Paginator<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected extends { pagination: PaginationState },
>({
  table,
  pageSizes = defaultPageSizes,
}: PaginatorProps<TFeatures, TData, TSelected>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const totalCount = table.getRowCount();
  const firstRow = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalCount);
  const pageSizeId = useId();

  function onPageSizeChange(value: string | null) {
    if (value !== null) {
      table.setPagination({
        pageIndex: 0,
        pageSize: Number(value),
      });
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 p-2">
      <label className="text-sm text-muted-foreground" htmlFor={pageSizeId}>
        Rows per page
      </label>
      <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
        <SelectTrigger size="sm" id={pageSizeId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizes.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="px-2 text-sm text-muted-foreground"
      >
        {firstRow > totalCount ? 'None' : `${firstRow}-${lastRow}`} of{' '}
        {totalCount}
      </div>

      <nav aria-label="Table pagination" className="flex gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="First page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.firstPage()}
              >
                <ChevronFirstIcon />
              </Button>
            }
          />
          <TooltipContent>First page</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Previous page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <ChevronLeftIcon />
              </Button>
            }
          />
          <TooltipContent>Previous page</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Next page"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <ChevronRightIcon />
              </Button>
            }
          />
          <TooltipContent>Next page</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Last page"
                disabled={!table.getCanLastPage()}
                onClick={() => table.lastPage()}
              >
                <ChevronLastIcon />
              </Button>
            }
          />
          <TooltipContent>Last page</TooltipContent>
        </Tooltip>
      </nav>
    </div>
  );
}
