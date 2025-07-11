import mongoose from "mongoose";

export class Comment {
  content: string;
  createdAt: string;
  postId: string;
  commentatorInfo: { userId: string; userLogin: string };
  dislikesCount: number;
  likesCount: number;

  constructor(
    content: string,
    userId: string,
    userLogin: string,
    postId: string
  ) {
    this.content = content;
    this.postId = postId;
    this.createdAt = new Date().toISOString();
    this.commentatorInfo = { userId, userLogin };
    this.dislikesCount = 0;
    this.likesCount = 0;
  }
}

const CommentsSchema = new mongoose.Schema<Comment>({
  content: {
    type: String,
    required: true,
    maxlength: 300,
  },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  dislikesCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
});

type CommentsModel = mongoose.Model<Comment>;

export type CommentDbDocument = mongoose.HydratedDocument<Comment>;

export const CommentsModel = mongoose.model<Comment, CommentsModel>(
  "Comment",
  CommentsSchema
);
