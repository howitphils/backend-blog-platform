import { PostLikeDbDocument } from "../db/mongodb/repositories/likes-repository/post-likes/post-like-entity";
import { LikeStatuses } from "./common-types";

export type PostInputModel = {
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
};

export type NewestLikeType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type PostViewModel = {
  id: string;
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatuses;
    newestLikes: NewestLikeType[];
  };
};

export type PostDbType = {
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
  blogName: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  newestLikes: PostLikeDbDocument[];
};

export type PostsRequestQueryType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type PostsMapedQueryType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type PostForBlogInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type PostForBlogDtoType = {
  title?: string;
  shortDescription?: string;
  content?: string;
};

export type PostDtoType = {
  title?: string;
  shortDescription?: string;
  content?: string;
  blogId: string;
};

export type UpdatePostLikeStatusDtoType = {
  postId: string;
  userId: string;
  likeStatus: LikeStatuses;
};
