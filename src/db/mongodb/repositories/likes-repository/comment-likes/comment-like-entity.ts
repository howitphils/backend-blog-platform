import mongoose from "mongoose";

export enum CommentLikeStatus {
  Like = "Like",
  Dislike = "Dislike",
  None = "None",
}

export class CommentLike {
  status: CommentLikeStatus;
  commentId: string;
  userId: string;
  createdAt: string;

  constructor(userId: string, commentId: string, status: CommentLikeStatus) {
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
    enum: Object.values(CommentLikeStatus),
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

export type CommentLikesDbDocument = mongoose.HydratedDocument<CommentLike>;

export const CommentLikesModel = mongoose.model<CommentLike, CommentLikesModel>(
  "CommentLikes",
  CommentLikesSchema
);
