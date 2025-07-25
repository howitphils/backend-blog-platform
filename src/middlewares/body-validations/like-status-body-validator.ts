import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../../types/http-statuses";
import { createErrorsObject } from "../../routers/controllers/utils";
import { APP_CONFIG } from "../../settings";
import { LikeStatuses } from "../../types/common-types";

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

  if (!Object.values(LikeStatuses).includes(likeStatus as LikeStatuses)) {
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
