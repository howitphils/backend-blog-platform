import { Response } from "express";
import {
  CommentInputModel,
  CommentViewModel,
  UpdateCommentLikeInputModel,
} from "../../types/comments-types";
import {
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../types/requests-types";
import { ParamsId } from "../../types/common-types";
import { ResultStatus } from "../../types/resultObject-types";
import { HttpStatuses } from "../../types/http-statuses";
import { convertToHttpCode } from "./utils";
import { CommentsQueryRepository } from "../../db/mongodb/repositories/comments-repository/comments-query-repository";
import { CommentsService } from "../../services/comments-service";
import { inject, injectable } from "inversify";
import { ErrorWithStatusCode } from "../../middlewares/error-handler";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,

    @inject(CommentsService)
    private commentsService: CommentsService
  ) {}

  async getCommentById(
    req: RequestWithParams<ParamsId>,
    res: Response<CommentViewModel>
  ) {
    const targetComment = await this.commentsQueryRepository.getCommentById(
      req.params.id,
      req.user.id
    );

    if (!targetComment) {
      throw new ErrorWithStatusCode("Comment not found", HttpStatuses.NotFound);
    }

    res.status(HttpStatuses.Success).json(targetComment);
  }

  async updateComment(
    req: RequestWithParamsAndBody<ParamsId, CommentInputModel>,
    res: Response
  ) {
    const updateResult = await this.commentsService.updateComment({
      commentBody: req.body,
      userId: req.user.id,
      commentId: req.params.id,
    });

    if (updateResult.status !== ResultStatus.Success) {
      res
        .status(convertToHttpCode(updateResult.status))
        .json(updateResult.extensions);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  }

  async deleteComment(req: RequestWithParams<ParamsId>, res: Response) {
    const deleteResult = await this.commentsService.deleteComment({
      commentId: req.params.id,
      userId: req.user.id,
    });

    if (deleteResult.status !== ResultStatus.Success) {
      res
        .status(convertToHttpCode(deleteResult.status))
        .json(deleteResult.extensions);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  }

  async updateLikeStatus(
    req: RequestWithParamsAndBody<ParamsId, UpdateCommentLikeInputModel>,
    res: Response
  ) {
    await this.commentsService.updateLikeStatus({
      userId: req.user.id,
      commentId: req.params.id,
      likeStatus: req.body.likeStatus,
    });

    res.sendStatus(HttpStatuses.NoContent);
  }
}
