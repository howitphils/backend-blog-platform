import mongoose from "mongoose";
import { PostsModelType } from "./repositories/posts-repository/post-entity";
import { BlogModel } from "./repositories/blogs-repository/blog-entity";
import { CommentsModel } from "./repositories/comments-repository/comments-entity";
import { UserModel } from "./repositories/users-repository/user-entitty";
import { SessionsModel } from "./repositories/sessions-repository/session-entity";
import { ApiCallsModel } from "./repositories/api-calls-repository/api-call-entity";

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
  await PostsModel.deleteMany({});
  await UserModel.deleteMany({});
  await CommentsModel.deleteMany({});
  await SessionsModel.deleteMany({});
  await ApiCallsModel.deleteMany({});
};
