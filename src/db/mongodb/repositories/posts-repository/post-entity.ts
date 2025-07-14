import mongoose from "mongoose";
import { PostLikeDbDocument } from "../likes-repository/post-likes/post-like-entity";
import { NewestLikeType } from "../../../../types/posts-types";

export class Post {
  title: string; // max 30
  shortDescription: string; // max 100
  content: string; // max 1000
  blogId: string; // valid
  blogName: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  newestLikes: PostLikeDbDocument[];

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
    this.likesCount = 0;
    this.dislikesCount = 0;
    this.newestLikes = [];
  }
}

const NewestLikeSchema = new mongoose.Schema<NewestLikeType>({
  addedAt: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

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
  dislikesCount: {
    type: Number,
    required: true,
  },
  likesCount: {
    type: Number,
    required: true,
  },
  newestLikes: { type: [NewestLikeSchema] },
});

type PostModel = mongoose.Model<Post>;

export type PostDbDocument = mongoose.HydratedDocument<Post>;

export const PostsModel = mongoose.model<Post, PostModel>("Post", PostsSchema);
