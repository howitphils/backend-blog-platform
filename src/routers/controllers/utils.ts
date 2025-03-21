import {
  BlogsMapedQueryType,
  BlogsRequestQueryType,
} from "../../types/blogs-types";
import {
  PostsMapedQueryType,
  PostsRequestQueryType,
} from "../../types/posts-types";

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
