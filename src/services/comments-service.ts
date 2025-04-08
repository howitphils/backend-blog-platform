import { ObjectId } from "mongodb";

import { blogsRepository } from "../db/mongodb/repositories/blogs-repository/blogs-db-repository";
import {
  CommentDbModel,
  CommentInputModel,
  CreateCommentDto,
} from "../types/comments-types";
import { commentsRepository } from "../db/mongodb/repositories/comments-repository/comments-db-repository";
import { postsService } from "./posts-service";
import { usersService } from "./users-service";

export const commentsService = {
  async createNewComment(dto: CreateCommentDto): Promise<ObjectId | null> {
    // Проверка на существование поста
    const targetPost = await postsService.getPostById(dto.postId);
    if (!targetPost) {
      return null;
    }

    const targetUser = await usersService.getUserById(new ObjectId(dto.userId));
    if (!targetUser) {
      return null;
    }

    // Создаем новый комментарий
    const newComment: CommentDbModel = {
      content: dto.commentBody.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: targetUser.login,
      },
      createdAt: new Date().toISOString(),
      postId: dto.postId.toString(),
    };

    // Возвращаем id созданного комментария
    return commentsRepository.createComment(newComment);
  },

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
