import {
  BlogsMapedQueryType,
  BlogsRequestQueryType,
} from "../../types/blogs-types";
import { CommentsRequestQueryType } from "../../types/comments-types";
import { HttpStatuses } from "../../types/http-statuses";
import {
  PostsMapedQueryType,
  PostsRequestQueryType,
} from "../../types/posts-types";
import { ResultStatus } from "../../types/resultObject-types";
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

export const convertToHttpCode = (
  status: keyof typeof ResultStatus
): number => {
  switch (status) {
    case "BadRequest":
      return HttpStatuses.BadRequest;
    case "Forbidden":
      return HttpStatuses.Forbidden;
    case "NotFound":
      return HttpStatuses.NotFound;
    case "Success":
      return HttpStatuses.Success;
    case "Unauthorized":
      return HttpStatuses.Unauthorized;

    default:
      return HttpStatuses.ServerError;
  }
};
