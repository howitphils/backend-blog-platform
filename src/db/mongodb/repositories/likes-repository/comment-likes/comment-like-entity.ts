import mongoose from "mongoose";
import { LikeStatuses } from "../../../../../types/common-types";
import { CommentLikeModelType } from "./comment-entity-types";
import { CommentLikeDto } from "../../../../../types/comments-types";

export class CommentLikeEntity {
  status: LikeStatuses;
  commentId: string;
  userId: string;
  createdAt: string;

  private constructor(userId: string, commentId: string, status: LikeStatuses) {
    this.userId = userId;
    this.commentId = commentId;
    this.status = status;
    this.createdAt = new Date().toISOString();
  }

  static createCommentLike(dto: CommentLikeDto) {
    return new CommentLikeModel(
      new CommentLikeEntity(dto.userId, dto.commentId, dto.likeStatus)
    );
  }

  updateStatus(newStatus: LikeStatuses) {
    this.status = newStatus;
  }
}

const CommentLikeSchema = new mongoose.Schema<CommentLikeEntity>({
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

CommentLikeSchema.loadClass(CommentLikeEntity);

export const CommentLikeModel = mongoose.model<
  CommentLikeEntity,
  CommentLikeModelType
>("CommentLikes", CommentLikeSchema);
