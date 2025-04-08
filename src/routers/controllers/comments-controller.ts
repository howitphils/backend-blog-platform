import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserId } from "../../types/users-types";
import { commentsQueryRepository } from "../../db/mongodb/repositories/comments-repository/comments-query-repository";
import { CommentInputModel } from "../../types/comments-types";
import { commentsService } from "../../services/comments-service";

export const commentsController = {
  async getCommentById(req: Request<{ id: ObjectId }>, res: Response) {
    const targetComment = await commentsQueryRepository.getCommentById(
      req.params.id
    );
    if (!targetComment) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(targetComment);
  },
  async updateComment(
    req: Request<{ id: ObjectId }, {}, CommentInputModel, {}, UserId>,
    res: Response
  ) {
    const isUpdated = await commentsService.updateComment(
      req.params.id,
      req.body
    );

    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
  async deleteComment(req: Request<{ id: ObjectId }>, res: Response) {
    const isDeleted = await commentsService.deleteComment(req.params.id);

    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  },
};
