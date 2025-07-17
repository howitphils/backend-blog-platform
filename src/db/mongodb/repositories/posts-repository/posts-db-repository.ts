import { PostModel } from "./post-entity";
import { PostDbDocumentType } from "./post-entity-types";

export class PostsRepository {
  async save(post: PostDbDocumentType) {
    const result = await post.save();
    return result.id;
  }

  async getPostById(id: string): Promise<PostDbDocumentType | null> {
    return PostModel.findById(id);
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
