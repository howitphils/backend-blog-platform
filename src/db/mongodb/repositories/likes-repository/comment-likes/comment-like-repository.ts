import { injectable } from "inversify";
import {
  CommentLikeDbDocument,
  CommentLikesModel,
} from "./comment-like-entity";

@injectable()
export class CommentLikesRepository {
  async save(like: CommentLikeDbDocument): Promise<string> {
    const result = await like.save();
    return result.id;
  }

  async getLikeById(id: string): Promise<CommentLikeDbDocument | null> {
    return CommentLikesModel.findById(id);
  }

  async getLikeByUserIdAndCommentId({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }): Promise<CommentLikeDbDocument | null> {
    return CommentLikesModel.findOne({ userId, commentId });
  }
}
