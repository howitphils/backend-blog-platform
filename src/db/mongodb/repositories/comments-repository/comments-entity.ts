import mongoose from "mongoose";

export class Comment {
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  postId: string;

  constructor(
    content: string,
    userId: string,
    userLogin: string,
    postId: string
  ) {
    this.content = content;
    this.commentatorInfo = { userId, userLogin };
    this.postId = postId;
    this.createdAt = new Date().toISOString();
  }
}

const CommentsSchema = new mongoose.Schema<Comment>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
});

type CommentsModel = mongoose.Model<Comment>;

export type CommentDbDocument = mongoose.HydratedDocument<Comment>;

export const CommentsModel = mongoose.model<Comment, CommentsModel>(
  "Comment",
  CommentsSchema
);
