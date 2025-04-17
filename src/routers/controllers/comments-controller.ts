import {
  RequestWithParamsAndBodyAndUserId,
  RequestWithParamsAndUserId,
} from "./../../types/requests-types";
import { Response } from "express";
import { UserId } from "../../types/users-types";
import { commentsQueryRepository } from "../../db/mongodb/repositories/comments-repository/comments-query-repository";
import {
  CommentInputModel,
  CommentViewModel,
  DeleteCommentDto,
  UpdateCommentDto,
} from "../../types/comments-types";
import { commentsService } from "../../services/comments-service";
import { RequestWithParams } from "../../types/requests-types";
import { ParamsId } from "../../types/common-types";
import { ResultStatus } from "../../types/resultObject-types";
import { HttpStatuses } from "../../types/http-statuses";
import { convertToHttpCode } from "./utils";

export const commentsController = {
  async getCommentById(
    req: RequestWithParams<ParamsId>,
    res: Response<CommentViewModel>
  ) {
    const targetComment = await commentsQueryRepository.getCommentById(
      req.params.id
    );
    if (!targetComment) {
      res.sendStatus(HttpStatuses.NotFound);
      return;
    }
    res.status(HttpStatuses.Success).json(targetComment);
  },

  async updateComment(
    req: RequestWithParamsAndBodyAndUserId<ParamsId, CommentInputModel, UserId>,
    res: Response
  ) {
    const userId = req.user?.id;
    if (!userId) {
      res.sendStatus(HttpStatuses.ServerError);
      return;
    }

    const commentId = req.params.id;
    const commentBody = req.body;

    const updateCommentDto: UpdateCommentDto = {
      userId,
      commentId,
      commentBody,
    };

    const updateResult = await commentsService.updateComment(updateCommentDto);

    if (updateResult.status !== ResultStatus.Success) {
      res
        .status(convertToHttpCode(updateResult.status))
        .json(updateResult.extensions);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  },

  async deleteComment(
    req: RequestWithParamsAndUserId<ParamsId, UserId>,
    res: Response
  ) {
    const commentId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.sendStatus(HttpStatuses.ServerError);
      return;
    }

    const deleteCommentDto: DeleteCommentDto = {
      userId,
      commentId,
    };

    const deleteResult = await commentsService.deleteComment(deleteCommentDto);

    if (deleteResult.status !== ResultStatus.Success) {
      res
        .status(convertToHttpCode(deleteResult.status))
        .json(deleteResult.extensions);
      return;
    }

    res.sendStatus(HttpStatuses.NoContent);
  },
};
