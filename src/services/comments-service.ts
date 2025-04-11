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
import { ResultObject, ResultStatus } from "../types/resultObject-types";

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

  async updateComment(
    dto: UpdateCommentDto
  ): Promise<ResultObject<boolean | null>> {
    const targetComment = await commentsService.getCommentById(dto.commentId);

    if (!targetComment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Comment is not found",
        extensions: [{ field: "commentId", message: "Wrong commentId" }],
        data: null,
      };
    }

    if (dto.userId !== targetComment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Forbidden",
        extensions: [{ field: "userId", message: "Wrong userId" }],
        data: null,
      };
    }

    const isUpdated = await commentsRepository.updateComment(
      dto.commentId,
      dto.commentBody
    );

    if (!isUpdated) {
      return {
        status: ResultStatus.ServerError,
        errorMessage: "Server error",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.NoContent,
      extensions: [],
      data: true,
    };
  },

  async deleteComment(
    dto: DeleteCommentDto
  ): Promise<ResultObject<boolean | null>> {
    const targetComment = await commentsService.getCommentById(dto.commentId);
    if (!targetComment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Comment is not found",
        extensions: [{ field: "commentId", message: "Wrong commentId" }],
        data: null,
      };
    }

    if (dto.userId !== targetComment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Forbidden",
        extensions: [{ field: "userId", message: "Wrong userId" }],
        data: null,
      };
    }

    const isDeleted = await commentsRepository.deleteComment(dto.commentId);

    if (!isDeleted) {
      return {
        status: ResultStatus.ServerError,
        errorMessage: "Server error",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.NoContent,
      extensions: [],
      data: true,
    };
  },
};
