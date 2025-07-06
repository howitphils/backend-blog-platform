import { ObjectId } from "mongodb";
import { PostDbType } from "../../../../types/posts-types";
import { PostDbDocument, PostsModel } from "./post-entity";

export class PostsRepository {
  async save(post: PostDbDocument) {
    const result = await post.save();
    return result.id;
  }

  async createNewPost(post: PostDbType): Promise<ObjectId> {
    const dbPost = new PostsModel(post);

    const createResult = await dbPost.save();

    return createResult._id;
  }

  async getPostById(id: string): Promise<PostDbType | null> {
    return PostsModel.findById(id);
  }

  // async updatePost(_id: ObjectId, post: PostInputModel): Promise<boolean> {
  //   // const dbPost = await PostsModel.findById(_id);

  //   const updateResult = await postsCollection.updateOne(
  //     { _id },
  //     { $set: { ...post } }
  //   );
  //   return updateResult.matchedCount === 1;
  // }

  // async deletePost(_id: ObjectId): Promise<boolean> {
  //   const deleteResult = await postsCollection.deleteOne({ _id });
  //   return deleteResult.deletedCount === 1;
  // }
}
