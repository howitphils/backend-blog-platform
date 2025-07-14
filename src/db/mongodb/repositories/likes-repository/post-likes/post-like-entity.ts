import mongoose from "mongoose";
import { LikeStatuses } from "../../../../../types/common-types";

export class PostLike {
  status: LikeStatuses;
  postId: string;
  userId: string;
  userLogin: string;
  createdAt: string;

  constructor(
    userId: string,
    postId: string,
    status: LikeStatuses,
    userLogin: string
  ) {
    this.userId = userId;
    this.postId = postId;
    this.status = status;
    this.userLogin = userLogin;
    this.createdAt = new Date().toISOString();
  }
}

const PostLikesSchema = new mongoose.Schema<PostLike>({
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
  createdAt: {
    type: String,
    required: true,
  },
});

type PostLikesModel = mongoose.Model<PostLike>;

export type PostLikeDbDocument = mongoose.HydratedDocument<PostLike>;

export const PostLikesModel = mongoose.model<PostLike, PostLikesModel>(
  "PostLikes",
  PostLikesSchema
);
