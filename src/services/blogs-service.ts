import { ObjectId, WithId } from "mongodb";

import { blogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { BlogDbType, BlogInputModel } from "../types/blogs-types";

export const blogsService = {
  // Получение всех блогов
  async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
    // Создаем новый блог
    const newBlog: BlogDbType = {
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    // Возвращаем id созданного блога
    return blogsRepository.createNewBlog(newBlog);
  },

  // Получение блога по айди
  async getBlogById(_id: ObjectId): Promise<WithId<BlogDbType> | null> {
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
