import mongoose from "mongoose";
import { CommentEntity } from "./comment-entity";
import { CreateDbCommentDto } from "../../../../types/comments-types";

export type CommentMethodsType = {
  updateCommentContent(content: string): void;
  // increaseLikesCount(): void;
  // decreaseLikesCount(): void;
  // increaseDislikesCount(): void;
  // decreaseDislikesCount(): void;
  updateCommentsLikeOrDislikeCount(
    field: "dislikesCount" | "likesCount",
    operation: "increase" | "decrease"
  ): void;
};

export type CommentStaticsType = {
  createComment(dto: CreateDbCommentDto): CommentDbDocumentType;
};

export type CommentDbDocumentType = mongoose.HydratedDocument<
  CommentEntity,
  CommentMethodsType
>;

export type CommentModelType = mongoose.Model<
  CommentEntity,
  {},
  CommentMethodsType
> &
  CommentStaticsType;
