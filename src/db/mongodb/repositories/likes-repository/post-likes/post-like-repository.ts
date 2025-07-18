import { injectable } from "inversify";
import { LikeStatuses } from "../../../../../types/common-types";
import { APP_CONFIG } from "../../../../../settings";
import { PostLikeDbDocumentType } from "./post-like-entity-types";
import { PostLikeModel } from "./post-like-entity";

@injectable()
export class PostLikesRepository {
  async save(like: PostLikeDbDocumentType): Promise<string> {
    const result = await like.save();
    return result.id;
  }

  async getLikeById(id: string): Promise<PostLikeDbDocumentType | null> {
    return PostLikeModel.findById(id);
  }

  async getPostLikeByUserIdAndPostId({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<PostLikeDbDocumentType | null> {
    return PostLikeModel.findOne({ userId, postId });
  }

  async getNewestLikes(
    postId: string,
    limit: number = APP_CONFIG.NEWEST_LIKES_LIMIT
  ): Promise<PostLikeDbDocumentType[]> {
    return PostLikeModel.find({
      postId,
      status: LikeStatuses.Like,
    })
      .sort({ addedAt: -1 })
      .limit(limit);
  }
}
