import { injectable } from "inversify";
import { PostLikeDbDocument, PostLikesModel } from "./post-like-entity";
import { LikeStatuses } from "../../../../../types/common-types";
import { APP_CONFIG } from "../../../../../settings";

@injectable()
export class PostLikesRepository {
  async save(like: PostLikeDbDocument): Promise<string> {
    const result = await like.save();
    return result.id;
  }

  async getLikeById(id: string): Promise<PostLikeDbDocument | null> {
    return PostLikesModel.findById(id);
  }

  async getPostLikeByUserIdAndPostId({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }): Promise<PostLikeDbDocument | null> {
    return PostLikesModel.findOne({ userId, postId });
  }

  async getNewestLikes(
    postId: string,
    limit: number = APP_CONFIG.NEWEST_LIKES_LIMIT
  ) {
    return PostLikesModel.find({
      postId,
      status: LikeStatuses.Like,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
