import { CommentLikeStatus } from "../db/mongodb/repositories/likes-repository/comment-likes/comment-like-entity";

export type CommentInputModel = {
  content: string;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: CommentLikeStatus;
};

export type CommentViewModel = {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfo;
};

export type CommentDbType = {
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  postId: string;
};

export type CommentsRequestQueryType = {
  pageNumber: string;
  pageSize: string;
  sortBy: string;
  sortDirection: string;
};

export type CommentsMapedQueryType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
};

export type CreateCommentDto = {
  userId: string;
  postId: string;
  commentBody: CommentInputModel;
};

export type UpdateCommentDto = {
  userId: string;
  commentId: string;
  commentBody: CommentInputModel;
};

export type DeleteCommentDto = {
  userId: string;
  commentId: string;
};

export type UpdateCommentLikeInputModel = {
  likeStatus: CommentLikeStatus;
};

export type CommentLikeDto = {
  userId: string;
  commentId: string;
  likeStatus: CommentLikeStatus;
};

export type CommentTestType = {
  postId?: string;
  content?: string;
  commentatorInfo?: CommentatorInfo;
};
