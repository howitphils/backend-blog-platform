import { ObjectId } from "mongodb";
import { PostDbType, PostInputModel } from "../../../types/posts-types";
import { postsCollection } from "../mongodb";

export const postsRepository = {
  async getAllPosts(): Promise<PostDbType[]> {
    return postsCollection.find({}).toArray();
  },
  async createNewPost(post: PostInputModel): Promise<ObjectId> {
    const newPost: PostDbType = {
      ...post,
      blogName: "Blog" + Math.random() * 1000,
      createdAt: new Date().toISOString(),
    };
    const createResult = await postsCollection.insertOne(newPost);
    return createResult.insertedId;
  },
  async getPostById(_id: ObjectId): Promise<PostDbType | null> {
    return postsCollection.findOne({ _id });
  },
  async updatePost(_id: ObjectId, post: PostInputModel): Promise<boolean> {
    const updateResult = await postsCollection.updateOne(
      { _id },
      { $set: { ...post } }
    );
    return updateResult.matchedCount === 1;
  },
  async deletePost(_id: ObjectId): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({ _id });
    return deleteResult.deletedCount === 1;
  },
};
