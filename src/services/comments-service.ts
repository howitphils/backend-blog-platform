import {
  CommentDbType,
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
