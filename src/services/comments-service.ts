import {
  CommentDbType,
  CommentLikeDto,
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from "../types/comments-types";
import { ResultObject, ResultStatus } from "../types/resultObject-types";
import { PostsService } from "./posts-service";
import { CommentsRepository } from "../db/mongodb/repositories/comments-repository/comments-db-repository";
import { UsersService } from "./users-service";
import { inject, injectable } from "inversify";
import {
  Comment,
  CommentsModel,
} from "../db/mongodb/repositories/comments-repository/comments-entity";
import {
  CommentLike,
  CommentLikesModel,
  CommentLikeStatus,
} from "../db/mongodb/repositories/likes-repository/comment-likes/comment-like-entity";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";

@injectable()
export class CommentsService {
  constructor(
    @inject(PostsService)
    private postsService: PostsService,

    @inject(CommentsRepository)
    private commentsRepository: CommentsRepository,

    @inject(UsersService)
    private usersService: UsersService
  ) {}

  async createNewComment(
    dto: CreateCommentDto
  ): Promise<ResultObject<string | null>> {
    const targetPost = await this.postsService.getPostById(dto.postId);

    if (!targetPost) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Post for this comment does not exist",
        extensions: [{ field: "postId", message: "incorrect postId" }],
        data: null,
      };
    }

    const targetUser = await this.usersService.getUserById(dto.userId);

    if (!targetUser) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "User is not found",
        extensions: [{ field: "userId", message: "incorrect userId" }],
        data: null,
      };
    }

    const { commentBody, postId, userId } = dto;

    const newComment = new Comment(
      commentBody.content,
      userId,
      targetUser.accountData.login,
      postId
    );

    const dbComment = new CommentsModel(newComment);

    const result = await dbComment.save();

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: result.id,
    };
  }

  async getCommentById(
    id: string
  ): Promise<ResultObject<CommentDbType | null>> {
    const comment = await this.commentsRepository.getCommentById(id);

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
    const targetComment = await this.commentsRepository.getCommentById(
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

    targetComment.content = dto.commentBody.content;

    await targetComment.save();

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  }

  async updateLikeStatus(dto: CommentLikeDto) {
    const targetComment = await this.commentsRepository.getCommentById(
      dto.commentId
    );

    if (!targetComment) {
      throw new ErrorWithStatusCode("Comment not found", HttpStatuses.NotFound);
    }

    const targetLike = await CommentLikesModel.findOne({
      userId: dto.userId,
      commentId: dto.commentId,
    });

    // Нужно ли добавлять проверку входящего статуса лайка на не None?
    if (!targetLike) {
      const newLike = new CommentLike(
        dto.userId,
        dto.commentId,
        dto.likeStatus
      );

      const dbLike = new CommentLikesModel(newLike);

      await dbLike.save();

      return;
    }

    // Если статус лайка не равен статусу лайка в запросе, то обновляем счетчики лайков и дизлайков
    if (dto.likeStatus !== targetLike.status) {
      // Если статус лайка в запросе - None, то убираем лайк или дизлайк
      if (dto.likeStatus === CommentLikeStatus.None) {
        if (targetLike.status === CommentLikeStatus.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetComment.likesCount -= 1;
        } else if (targetLike.status === CommentLikeStatus.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetComment.dislikesCount -= 1;

          if (targetComment.dislikesCount < 0) {
            targetComment.dislikesCount = 0; // Защита от отрицательного количества дизлайков
          }
        }
      }

      if (dto.likeStatus === CommentLikeStatus.Like) {
        if (targetLike.status === CommentLikeStatus.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetComment.dislikesCount -= 1;

          if (targetComment.dislikesCount < 0) {
            targetComment.dislikesCount = 0; // Защита от отрицательного количества дизлайков
          }
        }
        // Если текущий статус лайка - None, то просто добавляем лайк
        targetComment.likesCount += 1;
      }

      if (dto.likeStatus === CommentLikeStatus.Dislike) {
        if (targetLike.status === CommentLikeStatus.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetComment.likesCount -= 1;

          if (targetComment.likesCount < 0) {
            targetComment.likesCount = 0; // Защита от отрицательного количества лайков
          }
        }
        // Если текущий статус лайка - None, то просто добавляем дизлайк
        targetComment.dislikesCount += 1;
      }

      await this.commentsRepository.save(targetComment);

      // если статус лайка отличается от текущего, обновляем его
      targetLike.status = dto.likeStatus;

      await targetLike.save();
    }
  }

  async deleteComment(
    dto: DeleteCommentDto
  ): Promise<ResultObject<boolean | null>> {
    const targetComment = await this.commentsRepository.getCommentById(
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

    await targetComment.deleteOne();

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  }
}
