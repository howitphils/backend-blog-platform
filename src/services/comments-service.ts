import { ObjectId } from "mongodb";

import {
  CommentDbModel,
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
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

  async getCommentById(id: ObjectId): Promise<CommentDbModel | null> {
    return commentsRepository.getCommentById(id);
  },

  async updateComment(dto: UpdateCommentDto): Promise<boolean | null | string> {
    const targetComment = await commentsService.getCommentById(dto.commentId);

    if (!targetComment) {
      return null;
    }

    if (dto.userId !== targetComment.commentatorInfo.userId) {
      return "null";
    }

    return commentsRepository.updateComment(dto.commentId, dto.commentBody);
  },

  async deleteComment(dto: DeleteCommentDto): Promise<boolean | null | string> {
    const targetComment = await commentsService.getCommentById(dto.commentId);
    if (!targetComment) {
      return null;
    }
    if (targetComment.commentatorInfo.userId !== dto.userId) {
      return "null";
    }

    return commentsRepository.deleteComment(dto.commentId);
  },
};
