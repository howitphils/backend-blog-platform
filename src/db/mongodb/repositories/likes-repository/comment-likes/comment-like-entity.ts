import mongoose from "mongoose";
import { LikeStatuses } from "../../../../../types/common-types";

export class CommentLike {
  status: LikeStatuses;
  commentId: string;
  userId: string;
  createdAt: string;

  constructor(userId: string, commentId: string, status: LikeStatuses) {
    this.userId = userId;
    this.commentId = commentId;
    this.status = status;
    this.createdAt = new Date().toISOString();
  }
}

const CommentLikesSchema = new mongoose.Schema<CommentLike>({
  status: {
    type: String,
    required: true,
    enum: Object.values(LikeStatuses), // для валидации значения статуса - ожидается именно массив значений
  },
  commentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

type CommentLikesModel = mongoose.Model<CommentLike>;

export type CommentLikeDbDocument = mongoose.HydratedDocument<CommentLike>;

export const CommentLikesModel = mongoose.model<CommentLike, CommentLikesModel>(
  "CommentLikes",
  CommentLikesSchema
);
