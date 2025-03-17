export type RequestQueryType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type MapedQueryType = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
