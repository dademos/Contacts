export type PageRequest = {
  pageSize: number;
  pageIndex: number;
};

export type SortedPageRequest<T> = PageRequest & {
  sortBy: T;
  sortAsc: boolean;
};

export type SortedPageSearchRequest<T> = SortedPageRequest<T> & {
  searchTerm?: string | null;
};

export type PageResult<T> = {
  totalCount: number;
  items: T[];
};
