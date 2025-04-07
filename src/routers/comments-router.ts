import { Router } from "express";

import { bodyValidationResult } from "../middlewares/validation-result";
import { commentsController } from "./controllers/comments-controller";
import { commentsBodyValidators } from "../middlewares/body-validations/comments-body-validators";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { validateParamsId } from "../middlewares/validateParamsId";

export const commentsRouter = Router();

commentsRouter.get("/:id", validateParamsId, commentsController.getCommentById);

commentsRouter.put(
  "/:id",
  jwtAuthGuard,
  validateParamsId,
  commentsBodyValidators,
  bodyValidationResult,
  commentsController.updateComment
);

commentsRouter.delete(
  "/:id",
  jwtAuthGuard,
  validateParamsId,
  commentsController.deleteComment
);
