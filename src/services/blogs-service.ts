import { ObjectId } from "mongodb";

import { blogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { BlogDbType, BlogInputModel } from "../types/blogs-types";
import { PostDbType, PostInputModel } from "../types/posts-types";
import { postsRepository } from "../db/mongodb/repositories/posts-repository/posts-db-repository";
import { blogsQueryRepository } from "../db/mongodb/repositories/blogs-repository/blogs-query-repositoy";

export const blogsService = {
  // Получение всех блогов
  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    // Создаем новый блог
    const newBlog: BlogDbType = {
      ...blog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    // Возвращаем id созданного блога
    return blogsRepository.createNewBlog(newBlog);
  },

  async createNewPostForBlog(
    blogId: ObjectId,
    post: PostInputModel
  ): Promise<ObjectId | null> {
    // Получаем блог по id
    const targetBlog = await blogsQueryRepository.getBlogById(blogId);

    // Если блог не найден, возвращаем null
    if (!targetBlog) {
      return null;
    }

    // Если блог найден, создаем новый пост
    const newPost: PostDbType = {
      ...post,
      blogName: "Blog" + Math.random() * 1000,
      createdAt: new Date().toISOString(),
    };

    // Возвращаем id созданного поста
    return postsRepository.createNewPost(newPost);
  },

  // Получение блога по айди
  async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
    return blogsRepository.getBlogById(_id);
  },

  // Обновление блога
  async updateBlog(_id: ObjectId, blog: BlogInputModel): Promise<boolean> {
    return blogsRepository.updateBlog(_id, blog);
  },

  // Удаление блога
  async deleteBlog(_id: ObjectId): Promise<boolean> {
    return blogsRepository.deleteBlog(_id);
  },
};
