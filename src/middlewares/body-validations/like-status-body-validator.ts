import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { createErrorsObject } from "../../routers/controllers/utils";
import { CommentLikeStatus } from "../../db/mongodb/repositories/likes-repository/comment-likes/comment-like-entity";
import { APP_CONFIG } from "../../settings";

export const likeStatusBodyValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { likeStatus } = req.body;

  if (!likeStatus) {
    res
      .status(HttpStatuses.BadRequest)
      .json(
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.LIKE_STATUS,
          "likeStatus is required"
        )
      );
    return;
  }

  if (typeof likeStatus !== "string") {
    res
      .status(HttpStatuses.BadRequest)
      .json(
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.LIKE_STATUS,
          "likeStatus must be a string"
        )
      );
    return;
  }

  if (
    !Object.values(CommentLikeStatus).includes(likeStatus as CommentLikeStatus)
  ) {
    res
      .status(HttpStatuses.BadRequest)
      .json(
        createErrorsObject(
          APP_CONFIG.ERROR_FIELDS.LIKE_STATUS,
          "likeStatus has incorrect value"
        )
      );

    return;
  }

  next();
};
