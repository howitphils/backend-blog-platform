import mongoose from "mongoose";
import { CreatePostDto, PostInputModel } from "../../../../types/posts-types";
import { PostEntity } from "./post-entity";

export type PostMethodsType = {
  updatePost(dto: PostInputModel): PostEntity;
};

export type PostStaticsType = {
  createNewBlog(dto: CreatePostDto): PostDbDocument;
};

export type PostDbDocument = mongoose.HydratedDocument<
  PostEntity,
  PostMethodsType
>;

export type PostModelType = mongoose.Model<PostEntity, {}, PostMethodsType> &
  PostStaticsType;
