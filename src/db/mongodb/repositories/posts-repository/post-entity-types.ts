import mongoose from "mongoose";
import { CreatePostDto, PostInputModel } from "../../../../types/posts-types";
import { PostEntity } from "./post-entity";
import { PostLikeDbDocumentType } from "../likes-repository/post-likes/post-like-entity-types";

export type PostMethodsType = {
  updatePost(dto: PostInputModel): PostEntity;
  increaseLikesCount(): void;
  decreaseLikesCount(): void;
  increaseDislikesCount(): void;
  decreaseDislikesCount(): void;
  updateNewestLikes(newestLikes: PostLikeDbDocumentType[]): void;
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
