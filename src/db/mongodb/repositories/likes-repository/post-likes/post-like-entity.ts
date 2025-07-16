import mongoose from "mongoose";
import { LikeStatuses } from "../../../../../types/common-types";

export class PostLike {
  status: LikeStatuses;
  postId: string;
  userId: string;
  login: string;
  addedAt: string;

  constructor(
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
  addedAt: {
    type: String,
    required: true,
  },
  login: {
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
