import { ObjectId } from "mongodb";

export type PaginationType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type ParamsId = {
  id: ObjectId;
};
