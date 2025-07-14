import { injectable } from "inversify";
import { PostLikeDbDocument, PostLikesModel } from "./post-like-entity";

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
}
