import type {
  Column_RowSorting,
  RowData,
  TableFeatures,
} from '@tanstack/react-table';

export function getAriaSort<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(column: Column_RowSorting<TFeatures, TData>) {
  const sorted = column.getIsSorted();
  switch (sorted) {
    case 'asc':
      return 'ascending';
    case 'desc':
      return 'descending';
    default:
      return undefined;
  }
}
