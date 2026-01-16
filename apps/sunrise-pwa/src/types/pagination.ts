export type IPagination = {
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  limit?: number;
  nextPage?: number;
  offset?: number;
  total?: number;
  page?: number;
  pagingCounter?: number;
  prevPage?: any;
  totalDocs?: number;
  totalPages?: number;
};

export const PaginationPlaceholder: IPagination = {
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: 0,
  page: 0,
  total: 0,
  limit: 10,
  offset: 0,
  pagingCounter: 0,
  prevPage: 0,
  totalDocs: 0,
  totalPages: 0,
};
