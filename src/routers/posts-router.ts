import { bodyValidationResult } from "./../middlewares/validation-result";
import { postsBodyValidator } from "../middlewares/body-validations/posts-body-validators";
import { Router } from "express";

import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { postsController } from "./controllers/posts-controller";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { commentsBodyValidators } from "../middlewares/body-validations/comments-body-validators";
import { SETTINGS } from "../settings";

export const postsRouter = Router();

// Получение постов
postsRouter.get(SETTINGS.PATHS.POSTS.default, postsController.getPosts);

// Получение поста по айди
postsRouter.get(
  SETTINGS.PATHS.POSTS.postId,
  validateParamsId,
  postsController.getPostById
);

// Получение комментариев по айди поста
postsRouter.get(
  SETTINGS.PATHS.POSTS.comments,
  validateParamsId,
  postsController.getComments
);

// Создание комментария к посту
postsRouter.post(
  SETTINGS.PATHS.POSTS.comments,
  jwtAuthGuard,
  validateParamsId,
  commentsBodyValidators,
  bodyValidationResult,
  postsController.createComment
);

// Создание поста
postsRouter.post(
  SETTINGS.PATHS.POSTS.postId,
  authGuard,
  postsBodyValidator,
  bodyValidationResult,
  postsController.createPost
);

// Обновление поста
postsRouter.put(
  SETTINGS.PATHS.POSTS.postId,
  authGuard,
  validateParamsId,
  postsBodyValidator,
  bodyValidationResult,
  postsController.updatePost
);

// Удаление поста
postsRouter.delete(
  SETTINGS.PATHS.POSTS.postId,
  authGuard,
  validateParamsId,
  postsController.deletePost
);
