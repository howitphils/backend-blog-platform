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
import { CommentEntity } from "../db/mongodb/repositories/comments-repository/comment-entity";
import { CommentLikeEntity } from "../db/mongodb/repositories/likes-repository/comment-likes/comment-like-entity";
import { ErrorWithStatusCode } from "../middlewares/error-handler";
import { HttpStatuses } from "../types/http-statuses";
import { CommentLikesRepository } from "../db/mongodb/repositories/likes-repository/comment-likes/comment-like-repository";
import { LikeStatuses } from "../types/common-types";

@injectable()
export class CommentsService {
  constructor(
    @inject(PostsService)
    private postsService: PostsService,

    @inject(CommentsRepository)
    private commentsRepository: CommentsRepository,

    @inject(UsersService)
    private usersService: UsersService,

    @inject(CommentLikesRepository)
    private commentLikesRepository: CommentLikesRepository
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

    const newComment = CommentEntity.createComment({
      content: dto.commentBody.content,
      postId: dto.postId,
      userId: dto.userId,
      userLogin: targetUser.accountData.login,
    });

    const result = await this.commentsRepository.save(newComment);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: result,
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

    targetComment.updateCommentContent(dto.commentBody.content);

    await this.commentsRepository.save(targetComment);

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

    const targetLike =
      await this.commentLikesRepository.getLikeByUserIdAndCommentId({
        userId: dto.userId,
        commentId: dto.commentId,
      });

    if (!targetLike) {
      const newLike = CommentLikeEntity.createCommentLike(dto);

      await this.commentLikesRepository.save(newLike);

      if (dto.likeStatus === LikeStatuses.Like) {
        targetComment.updateCommentsLikeOrDislikeCount(
          "likesCount",
          "increase"
        );
      } else if (dto.likeStatus === LikeStatuses.Dislike) {
        targetComment.updateCommentsLikeOrDislikeCount(
          "dislikesCount",
          "increase"
        );
      }

      await this.commentsRepository.save(targetComment);

      return;
    }

    // Если статус лайка не равен статусу лайка в запросе, то обновляем счетчики лайков и дизлайков
    if (dto.likeStatus !== targetLike.status) {
      // Если статус лайка в запросе - None, то убираем лайк или дизлайк
      if (dto.likeStatus === LikeStatuses.None) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetComment.updateCommentsLikeOrDislikeCount(
            "likesCount",
            "decrease"
          );
        } else if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetComment.updateCommentsLikeOrDislikeCount(
            "dislikesCount",
            "decrease"
          );
        }
      }

      if (dto.likeStatus === LikeStatuses.Like) {
        if (targetLike.status === LikeStatuses.Dislike) {
          // Если текущий статус лайка - дизлайк, то убираем дизлайк
          targetComment.updateCommentsLikeOrDislikeCount(
            "dislikesCount",
            "decrease"
          );
        }
        // Если текущий статус лайка - None, то просто добавляем лайк
        targetComment.updateCommentsLikeOrDislikeCount(
          "likesCount",
          "increase"
        );
      }

      if (dto.likeStatus === LikeStatuses.Dislike) {
        if (targetLike.status === LikeStatuses.Like) {
          // Если текущий статус лайка - лайк, то убираем лайк
          targetComment.updateCommentsLikeOrDislikeCount(
            "likesCount",
            "decrease"
          );
        }
        // Если текущий статус лайка - None, то просто добавляем дизлайк
        targetComment.updateCommentsLikeOrDislikeCount(
          "dislikesCount",
          "increase"
        );
      }

      // если статус лайка отличается от текущего, обновляем его
      targetLike.updateStatus(dto.likeStatus);

      Promise.all([
        this.commentLikesRepository.save(targetLike),
        this.commentsRepository.save(targetComment),
      ]);
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
