import { ObjectId } from "mongodb";
import { PostInputModel, PostViewModel } from "../../../types/posts-types";
import { postsCollection } from "../mongodb";

export const postsRepository = {
  async getAllPosts() {
    return postsCollection.find({}).toArray();
  },
  async createNewPost(post: PostInputModel): Promise<ObjectId> {
    const newPost: PostViewModel = {
      ...post,
      id: String(Math.random() * 1000),
      blogName: "Blog" + Math.random() * 1000,
      createdAt: new Date().toISOString(),
    };
    const createResult = await postsCollection.insertOne(newPost);
    return createResult.insertedId;
  },
  async getPostById(id: string): Promise<PostViewModel | null> {
    return postsCollection.findOne({ id });
  },
  async getPostByUUId(_id: ObjectId): Promise<PostViewModel | null> {
    return postsCollection.findOne({ _id });
  },
  async updatePost(id: string, post: PostInputModel): Promise<boolean> {
    const updateResult = await postsCollection.updateOne(
      { id },
      { $set: { ...post } }
    );
    return updateResult.matchedCount === 1;
  },
  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({ id });
    return deleteResult.deletedCount === 1;
  },
};
