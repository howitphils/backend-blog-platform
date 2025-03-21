import { ObjectId } from "mongodb";
import { postsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { PostDbType, PostInputModel } from "../types/posts-types";

export const postsService = {
  // Создание нового поста
  async createNewPost(post: PostInputModel): Promise<ObjectId> {
    const newPost: PostDbType = {
      ...post,
      blogName: "Blog" + Math.random() * 1000,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.createNewPost(newPost);
  },

  // Получение поста по его ID
  async getPostById(_id: ObjectId): Promise<PostDbType | null> {
    return postsRepository.getPostById(_id);
  },

  // Обновление поста
  async updatePost(_id: ObjectId, post: PostInputModel): Promise<boolean> {
    return postsRepository.updatePost(_id, post);
  },

  // Удаление поста
  async deletePost(_id: ObjectId): Promise<boolean> {
    return postsRepository.deletePost(_id);
  },
};
