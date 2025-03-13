export type RequestQueryType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
};
