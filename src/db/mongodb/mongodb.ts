import mongoose from "mongoose";
import { BlogModel } from "./repositories/blogs-repository/blog-entity";
import { UserModel } from "./repositories/users-repository/user-entitty";
import { SessionModel } from "./repositories/sessions-repository/session-entity";
import { ApiCallsModel } from "./repositories/api-calls-repository/api-call-entity";
import { PostModel } from "./repositories/posts-repository/post-entity";
import { CommentModel } from "./repositories/comments-repository/comment-entity";
import { CommentLikeModel } from "./repositories/likes-repository/comment-likes/comment-like-entity";
import { PostLikeModel } from "./repositories/likes-repository/post-likes/post-like-entity";

export const runDb = async (url: string, dbName: string | undefined) => {
  try {
    await mongoose.connect(`${url}/${dbName}`);
    console.log("connected to db");
  } catch (error) {
    await mongoose.disconnect();
    console.error("Error connecting to the database:", error);
  }
};

export const clearCollections = async () => {
  await BlogModel.deleteMany({});
  await PostModel.deleteMany({});
  await UserModel.deleteMany({});
  await CommentModel.deleteMany({});
  await SessionModel.deleteMany({});
  await ApiCallsModel.deleteMany({});
  await CommentLikeModel.deleteMany({});
  await PostLikeModel.deleteMany({});
};
