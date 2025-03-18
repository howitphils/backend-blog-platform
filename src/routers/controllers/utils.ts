import {
  BlogDbType,
  BlogsMapedQueryType,
  BlogsRequestQueryType,
  BlogViewModel,
} from "../../types/blogs-types";
import {
  PostDbType,
  PostsMapedQueryType,
  PostsRequestQueryType,
  PostViewModel,
} from "../../types/posts-types";

export const mapFromDbToViewModel = (
  obj: BlogDbType | PostDbType
): BlogViewModel | PostViewModel => {
  const { _id, ...rest } = obj;
  return { ...rest, id: _id!.toString() };
};

export const mapBlogsQueryParams = (
  queryParams: BlogsRequestQueryType
): BlogsMapedQueryType => {
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

export const mapPostsQueryParams = (
  queryParams: PostsRequestQueryType
): PostsMapedQueryType => {
  const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

  return {
    pageNumber: pageNumber ? +pageNumber : 1,
    pageSize: pageSize ? +pageSize : 10,
    sortBy: sortBy ? sortBy : "createdAt",
    sortDirection: sortDirection ? sortDirection : "desc",
  };
};
