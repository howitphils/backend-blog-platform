import mongoose from "mongoose";
import {
  CreatePostDto,
  NewestLikeType,
  PostInputModel,
} from "../../../../types/posts-types";
import { PostEntity } from "./post-entity";

export type PostMethodsType = {
  updatePost(dto: PostInputModel): PostEntity;
  increaseLikesCount(): void;
  decreaseLikesCount(): void;
  increaseDislikesCount(): void;
  decreaseDislikesCount(): void;
  updateNewestLikes(newestLikes: NewestLikeType[]): void;
};

export type PostStaticsType = {
  createNewBlog(dto: CreatePostDto): PostDbDocumentType;
};

export type PostDbDocumentType = mongoose.HydratedDocument<
  PostEntity,
  PostMethodsType
>;

export type PostModelType = mongoose.Model<PostEntity, {}, PostMethodsType> &
  PostStaticsType;
