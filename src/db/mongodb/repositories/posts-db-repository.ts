import { PostInputModel, PostViewModel } from "../../../types/posts-types";
import { postsCollection } from "../mongodb";

export const postsRepository = {
  async getAllPosts() {
    const posts = await postsCollection.find({}).toArray();
    return posts;
  },
  async createNewPost(post: PostInputModel): Promise<PostViewModel> {
    const newPost: PostViewModel = {
      ...post,
      id: String(Math.random() * 1000),
      blogName: "Blog" + Math.random() * 1000,
      createdAt: new Date().toISOString(),
    };
    await postsCollection.insertOne(newPost);
    return newPost;
  },
  async getPostById(id: string): Promise<PostViewModel | null> {
    const targetPost = postsCollection.findOne({ id });
    return targetPost;
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
