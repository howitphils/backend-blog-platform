import mongoose from "mongoose";
import { PostDbType } from "../../../../types/posts-types";

const postsSchema = new mongoose.Schema<PostDbType>({
  title: { type: String },
  blogId: { type: String },
  blogName: { type: String },
  content: { type: String },
  createdAt: { type: String },
  shortDescription: { type: String },
});

type PostModel = mongoose.Model<PostDbType>;

export type PostDbDocument = mongoose.HydratedDocument<PostDbType>;

export const PostsModel = mongoose.model<PostDbType, PostModel>(
  "Post",
  postsSchema
);
