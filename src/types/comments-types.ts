import { ObjectId } from "mongodb";

export type CommentInputModel = {
  content: string;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};

export type CommentDbModel = {
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
  postId: ObjectId;
  commentBody: CommentInputModel;
};
