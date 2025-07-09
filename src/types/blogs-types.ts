export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogDbType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogsRequestQueryType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type BlogsMapedQueryType = {
  searchNameTerm: string | null;
  sortBy: string | "createdAt";
  sortDirection: string | "desc";
  pageNumber: number;
  pageSize: number;
};

export type BlogDtoType = {
  name?: string;
  description?: string;
  websiteUrl?: string;
};
