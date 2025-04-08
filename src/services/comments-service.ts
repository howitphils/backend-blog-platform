import { ObjectId } from "mongodb";

import { blogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import { CommentInputModel } from "../types/comments-types";

export const commentsService = {
  // async createNewBlog(blog: BlogInputModel): Promise<ObjectId> {
  //   // Создаем новый блог
  //   const newBlog: BlogDbType = {
  //     name: blog.name,
  //     description: blog.description,
  //     websiteUrl: blog.websiteUrl,
  //     createdAt: new Date().toISOString(),
  //     isMembership: false,
  //   };

  //   // Возвращаем id созданного блога
  //   return blogsRepository.createNewBlog(newBlog);
  // },

  // // Получение блога по айди
  // async getBlogById(_id: ObjectId): Promise<BlogDbType | null> {
  //   return blogsRepository.getBlogById(_id);
  // },

  async updateComment(
    _id: ObjectId,
    comment: CommentInputModel
  ): Promise<boolean> {
    // return blogsRepository.updateBlog(_id, blog);
  },

  async deleteComment(_id: ObjectId): Promise<boolean> {
    return blogsRepository.deleteBlog(_id);
  },
};
