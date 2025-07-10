import mongoose from "mongoose";

export class Post {
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
  blogName: string;
  createdAt: string;

  constructor(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
  }
}

const PostsSchema = new mongoose.Schema<Post>({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  blogId: {
    type: String,
    required: true,
  },
  blogName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

type PostModel = mongoose.Model<Post>;

export type PostDbDocument = mongoose.HydratedDocument<Post>;

export const PostsModel = mongoose.model<Post, PostModel>("Post", PostsSchema);
