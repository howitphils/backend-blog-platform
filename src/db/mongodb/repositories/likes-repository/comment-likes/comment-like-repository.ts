import { injectable } from "inversify";
import { CommentLikeDbDocumentType } from "./comment-entity-types";
import { CommentLikeModel } from "./comment-like-entity";

@injectable()
export class CommentLikesRepository {
  async save(like: CommentLikeDbDocumentType): Promise<string> {
    const result = await like.save();
    return result.id;
  }

  async getLikeById(id: string): Promise<CommentLikeDbDocumentType | null> {
    return CommentLikeModel.findById(id);
  }

  async getLikeByUserIdAndCommentId({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }): Promise<CommentLikeDbDocumentType | null> {
    return CommentLikeModel.findOne({ userId, commentId });
  }
}
