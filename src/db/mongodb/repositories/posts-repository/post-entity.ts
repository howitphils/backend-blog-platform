import mongoose from "mongoose";

export class Post {
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
  blogName: string;
  createdAt: string;

  constructor(
    name: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    this.title = name;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
  }
}

const postsSchema = new mongoose.Schema<Post>({
  title: { type: String },
  blogId: { type: String },
  blogName: { type: String },
  content: { type: String },
  createdAt: { type: String },
  shortDescription: { type: String },
});

type PostModel = mongoose.Model<Post>;

export type PostDbDocument = mongoose.HydratedDocument<Post>;

export const PostsModel = mongoose.model<Post, PostModel>("Post", postsSchema);
