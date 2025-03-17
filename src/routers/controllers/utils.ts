import { BlogDbType, BlogViewModel } from "../../types/blogs-types";
import { PostDbType, PostViewModel } from "../../types/posts-types";
import { MapedQueryType, RequestQueryType } from "../../types/request-types";

export const mapFromDbToViewModel = (
  obj: BlogDbType | PostDbType
): BlogViewModel | PostViewModel => {
  const { _id, ...rest } = obj;
  return { ...rest, id: _id!.toString() };
};

export const mapQueryParams = (
  queryParams: RequestQueryType
): MapedQueryType => {
  const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
    queryParams;

  return {
    searchNameTerm: searchNameTerm ? searchNameTerm : null,
    pageNumber: pageNumber ? +pageNumber : 1,
    pageSize: pageSize ? +pageSize : 10,
    sortBy: sortBy ? sortBy : "createdAt",
    sortDirection: sortDirection ? sortDirection : "desc",
  };
};
