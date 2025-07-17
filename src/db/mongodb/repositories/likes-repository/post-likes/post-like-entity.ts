import mongoose from "mongoose";
import { LikeStatuses } from "../../../../../types/common-types";
import { PostLikeModelType } from "./post-like-entity-types";
import { CreatePostLikeDto } from "../../../../../types/posts-types";

export class PostLikeEntity {
  status: LikeStatuses;
  postId: string;
  userId: string;
  login: string;
  addedAt: string;

  private constructor(
    userId: string,
    postId: string,
    status: LikeStatuses,
    userLogin: string
  ) {
    this.userId = userId;
    this.postId = postId;
    this.status = status;
    this.login = userLogin;
    this.addedAt = new Date().toISOString();
  }

  static createPostLike(dto: CreatePostLikeDto) {
    return new PostLikeModel(
      new PostLikeEntity(dto.userId, dto.postId, dto.likeStatus, dto.login)
    );
  }

  updateStatus(newStatus: LikeStatuses) {
    this.status = newStatus;
  }
}

const PostLikeSchema = new mongoose.Schema<PostLikeEntity>({
  status: {
    type: String,
    required: true,
    enum: Object.values(LikeStatuses), // для валидации значения статуса - ожидается именно массив значений
  },
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  addedAt: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
});

PostLikeSchema.loadClass(PostLikeEntity);

export const PostLikeModel = mongoose.model<PostLikeEntity, PostLikeModelType>(
  "PostLike",
  PostLikeSchema
);
