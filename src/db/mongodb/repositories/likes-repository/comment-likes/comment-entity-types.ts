import mongoose from "mongoose";
import { CommentLikeEntity } from "./comment-like-entity";
import { CommentLikeDto } from "../../../../../types/comments-types";

export type CommentLikeMethodsType = {};

export type CommentLikeStaticsType = {
  createCommentLike(dto: CommentLikeDto): CommentLikeDbDocumentType;
};

export type CommentLikeDbDocumentType = mongoose.HydratedDocument<
  CommentLikeEntity,
  CommentLikeMethodsType
>;

export type CommentLikeModelType = mongoose.Model<
  CommentLikeEntity,
  {},
  CommentLikeMethodsType
> &
  CommentLikeStaticsType;
