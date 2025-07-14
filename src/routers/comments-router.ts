import { container } from "./../composition-root";
import { Router } from "express";

import { bodyValidationResult } from "../middlewares/validation-result";
import { commentsBodyValidators } from "../middlewares/body-validations/comments-body-validators";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { CommentsController } from "./controllers/comments-controller";
import { checkUserInRequest } from "../middlewares/check-req-user";
import { likeStatusBodyValidator } from "../middlewares/body-validations/like-status-body-validator";
import { jwtAuthOptional } from "../middlewares/jwt-optional-auth";

const commentsController = container.get(CommentsController);

export const commentsRouter = Router();

commentsRouter.get(
  "/:id",
  jwtAuthOptional,
  validateParamsId,
  commentsController.getCommentById.bind(commentsController)
);

commentsRouter.put(
  "/:id",
  jwtAuthGuard,
  checkUserInRequest,
  validateParamsId,
  commentsBodyValidators,
  bodyValidationResult,
  commentsController.updateComment.bind(commentsController)
);

commentsRouter.put(
  "/:id/like-status",
  jwtAuthGuard,
  checkUserInRequest,
  validateParamsId,
  likeStatusBodyValidator,
  commentsController.updateLikeStatus.bind(commentsController)
);

commentsRouter.delete(
  "/:id",
  jwtAuthGuard,
  checkUserInRequest,
  validateParamsId,
  commentsController.deleteComment.bind(commentsController)
);
