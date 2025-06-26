import { ObjectId } from "mongodb";

import {
  CommentDbType,
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from "../types/comments-types";
import { commentsRepository } from "../db/mongodb/repositories/comments-repository/comments-db-repository";
import { postsService } from "./posts-service";
import { usersService } from "./users-service";
import { ResultObject, ResultStatus } from "../types/resultObject-types";

class CommentsService {
  async createNewComment(
    dto: CreateCommentDto
  ): Promise<ResultObject<ObjectId | null>> {
    const targetPost = await postsService.getPostById(dto.postId);

    if (!targetPost) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Post for this comment does not exist",
        extensions: [{ field: "postId", message: "incorrect postId" }],
        data: null,
      };
    }

    const targetUser = await usersService.getUserById(new ObjectId(dto.userId));
    if (!targetUser) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "User is not found",
        extensions: [{ field: "userId", message: "incorrect userId" }],
        data: null,
      };
    }

    const newComment: CommentDbType = {
      content: dto.commentBody.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: targetUser.accountData.login,
      },
      createdAt: new Date().toISOString(),
      postId: dto.postId.toString(),
    };

    const newCommentId = await commentsRepository.createComment(newComment);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: newCommentId,
    };
  }

  async getCommentById(
    id: ObjectId
  ): Promise<ResultObject<CommentDbType | null>> {
    const comment = await commentsRepository.getCommentById(id);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Comment is not found",
        extensions: [{ field: "commentId", message: "Wrong commentId" }],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: comment,
    };
  }

  async updateComment(
    dto: UpdateCommentDto
  ): Promise<ResultObject<boolean | null>> {
    const targetComment = await commentsRepository.getCommentById(
      dto.commentId
    );

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

    await commentsRepository.updateComment(dto.commentId, dto.commentBody);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  }

  async deleteComment(
    dto: DeleteCommentDto
  ): Promise<ResultObject<boolean | null>> {
    const targetComment = await commentsRepository.getCommentById(
      dto.commentId
    );

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
        errorMessage: "Forbidden action",
        extensions: [{ field: "userId", message: "Wrong userId" }],
        data: null,
      };
    }

    await commentsRepository.deleteComment(dto.commentId);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  }
}

export const commentsService = new CommentsService();
