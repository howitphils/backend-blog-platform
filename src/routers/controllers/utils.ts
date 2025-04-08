import {
  BlogsMapedQueryType,
  BlogsRequestQueryType,
} from "../../types/blogs-types";
import { CommentsRequestQueryType } from "../../types/comments-types";
import {
  PostsMapedQueryType,
  PostsRequestQueryType,
} from "../../types/posts-types";
import {
  UsersMapedQueryType,
  UsersRequestQueryType,
} from "../../types/users-types";

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
    sortDirection: sortDirection === "asc" ? sortDirection : "desc",
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
    sortDirection: sortDirection === "asc" ? sortDirection : "desc",
  };
};

export const mapUsersQueryParams = (
  queryParams: UsersRequestQueryType
): UsersMapedQueryType => {
  const {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchEmailTerm,
    searchLoginTerm,
  } = queryParams;

  return {
    searchEmailTerm: searchEmailTerm ? searchEmailTerm : null,
    searchLoginTerm: searchLoginTerm ? searchLoginTerm : null,
    pageNumber: pageNumber ? +pageNumber : 1,
    pageSize: pageSize ? +pageSize : 10,
    sortBy: sortBy ? sortBy : "createdAt",
    sortDirection: sortDirection === "asc" ? sortDirection : "desc",
  };
};

export const mapCommentsQueryParams = (
  queryParams: CommentsRequestQueryType
): PostsMapedQueryType => {
  const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

  return {
    pageNumber: pageNumber ? +pageNumber : 1,
    pageSize: pageSize ? +pageSize : 10,
    sortBy: sortBy ? sortBy : "createdAt",
    sortDirection: sortDirection === "asc" ? sortDirection : "desc",
  };
};
