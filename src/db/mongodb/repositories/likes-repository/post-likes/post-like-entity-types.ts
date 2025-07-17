import mongoose from "mongoose";
import { PostLikeEntity } from "./post-like-entity";

export type PostLikeMethodsType = {
  updateStatus(newStatus: string): void;
};

export type PostlikeStaticsType = {
  createPostLike(): PostLikeDbDocumentType;
};

export type PostLikeDbDocumentType = mongoose.HydratedDocument<
  PostLikeEntity,
  PostLikeMethodsType
>;

export type PostLikeModelType = mongoose.Model<
  PostLikeEntity,
  {},
  PostLikeMethodsType
> &
  PostlikeStaticsType;
