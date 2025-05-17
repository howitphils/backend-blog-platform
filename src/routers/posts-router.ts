import { bodyValidationResult } from "./../middlewares/validation-result";
import { postsBodyValidator } from "../middlewares/body-validations/posts-body-validators";
import { Router } from "express";

import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { postsController } from "./controllers/posts-controller";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { commentsBodyValidators } from "../middlewares/body-validations/comments-body-validators";

export const postsRouter = Router();

// Получение постов
postsRouter.get("/", postsController.getPosts);

// Получение поста по айди
postsRouter.get("/:id", validateParamsId, postsController.getPostById);

// Получение комментариев по айди поста
postsRouter.get("/:id/comments", validateParamsId, postsController.getComments);

// Создание комментария к посту
postsRouter.post(
  "/:id/comments",
  jwtAuthGuard,
  validateParamsId,
  commentsBodyValidators,
  bodyValidationResult,
  postsController.createComment
);

// Создание поста
postsRouter.post(
  "/",
  authGuard,
  postsBodyValidator,
  bodyValidationResult,
  postsController.createPost
);

// Обновление поста
postsRouter.put(
  "/:id",
  authGuard,
  validateParamsId,
  postsBodyValidator,
  bodyValidationResult,
  postsController.updatePost
);

// Удаление поста
postsRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  postsController.deletePost
);
