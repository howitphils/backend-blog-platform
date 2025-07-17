import mongoose from "mongoose";
import {
  CommentDbDocumentType,
  CommentMethodsType,
  CommentModelType,
} from "./comment-entity-types";
import { CreateDbCommentDto } from "../../../../types/comments-types";

export class CommentEntity {
  content: string;
  createdAt: string;
  postId: string;
  commentatorInfo: { userId: string; userLogin: string };
  dislikesCount: number;
  likesCount: number;

  private constructor(
    content: string,
    userId: string,
    userLogin: string,
    postId: string
  ) {
    this.content = content;
    this.postId = postId;
    this.commentatorInfo = { userId, userLogin };
    this.createdAt = new Date().toISOString();
    this.dislikesCount = 0;
    this.likesCount = 0;
  }

  static createComment(dto: CreateDbCommentDto): CommentDbDocumentType {
    return new CommentModel(
      new CommentEntity(dto.content, dto.userId, dto.userLogin, dto.postId)
    );
  }

  updateCommentContent(content: string) {
    this.content = content;
  }

  // increaseLikesCount() {
  //   this.likesCount += 1;
  // }
  // decreaseLikesCount() {
  //   this.likesCount -= 1;
  // }

  // increaseDislikesCount() {
  //   this.dislikesCount += 1;
  // }
  // decreaseDislikesCount() {
  //   this.dislikesCount -= 1;
  // }

  updateCommentsLikeOrDislikeCount(
    field: "dislikesCount" | "likesCount",
    operation: "increase" | "decrease"
  ) {
    if (operation === "increase") {
      this[field] += 1;
    } else if (operation === "decrease") {
      this[field] -= 1;
    }

    if (this[field] < 0) {
      this[field] = 0;
    }
  }
}

const CommentSchema = new mongoose.Schema<
  CommentEntity,
  CommentModelType,
  CommentMethodsType
>({
  content: {
    type: String,
    required: true,
    maxlength: 300,
    minlength: 1,
  },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  dislikesCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
});

CommentSchema.loadClass(CommentEntity);

export const CommentModel = mongoose.model<CommentEntity, CommentModelType>(
  "Comment",
  CommentSchema
);
