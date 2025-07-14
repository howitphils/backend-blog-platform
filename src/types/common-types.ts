export enum LikeStatuses {
  Like = "Like",
  Dislike = "Dislike",
  None = "None",
}

export type PaginationType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type ParamsId = {
  id: string;
};

export type LikesStatusesObjType = {
  [key: string]: LikeStatuses;
};
