import { container } from "./../composition-root";
import { Router } from "express";

import { bodyValidationResult } from "../middlewares/validation-result";
import { commentsBodyValidators } from "../middlewares/body-validations/comments-body-validators";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { CommentsController } from "./controllers/comments-controller";
import { checkUserInRequest } from "../middlewares/check-req-user";

const commentsController = container.get(CommentsController);

export const commentsRouter = Router();

commentsRouter.get(
  "/:id",
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

commentsRouter.delete(
  "/:id",
  jwtAuthGuard,
  checkUserInRequest,
  validateParamsId,
  commentsController.deleteComment.bind(commentsController)
);
