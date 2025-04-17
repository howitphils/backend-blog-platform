import { ObjectId } from "mongodb";
import { postsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { PostDbType, PostInputModel } from "../types/posts-types";
import { blogsService } from "./blogs-service";
import { CustomError } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";

export const postsService = {
  // Создание нового поста
  async createNewPost(post: PostInputModel): Promise<ObjectId> {
    if (!ObjectId.isValid(post.blogId)) {
      throw new CustomError("Invalid blogId", HttpStatuses.BadRequest);
    }

    const targetBlog = await blogsService.getBlogById(
      new ObjectId(post.blogId)
    );

    const newPost: PostDbType = {
      blogId: post.blogId,
      content: post.content,
      shortDescription: post.shortDescription,
      title: post.title,
      blogName: targetBlog.name,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.createNewPost(newPost);
  },

  // Получение поста по его ID
  async getPostById(id: ObjectId): Promise<PostDbType | null> {
    return postsRepository.getPostById(id);
  },

  // Обновление поста
  async updatePost(id: ObjectId, post: PostInputModel): Promise<boolean> {
    return postsRepository.updatePost(id, post);
  },

  // Удаление поста
  async deletePost(id: ObjectId): Promise<boolean> {
    return postsRepository.deletePost(id);
  },
};
