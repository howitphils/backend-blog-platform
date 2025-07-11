import { bodyValidationResult } from "./../middlewares/validation-result";
import { postsBodyValidator } from "../middlewares/body-validations/posts-body-validators";
import { Router } from "express";

import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { commentsBodyValidators } from "../middlewares/body-validations/comments-body-validators";
import { container } from "../composition-root";
import { PostsController } from "./controllers/posts-controller";

const postsController = container.get(PostsController);

export const postsRouter = Router();

// Получение постов
postsRouter.get("/", postsController.getPosts.bind(postsController));

// Получение поста по айди
postsRouter.get(
  "/:id",
  validateParamsId,
  postsController.getPostById.bind(postsController)
);

// Получение комментариев по айди поста
postsRouter.get(
  "/:id/comments",
  validateParamsId,
  postsController.getComments.bind(postsController)
);

// Создание комментария к посту
postsRouter.post(
  "/:id/comments",
  jwtAuthGuard,
  validateParamsId,
  commentsBodyValidators,
  bodyValidationResult,
  postsController.createComment.bind(postsController)
);

// Создание поста
postsRouter.post(
  "/",
  authGuard,
  postsBodyValidator,
  bodyValidationResult,
  postsController.createPost.bind(postsController)
);

// Обновление поста
postsRouter.put(
  "/:id",
  authGuard,
  validateParamsId,
  postsBodyValidator,
  bodyValidationResult,
  postsController.updatePost.bind(postsController)
);

// Удаление поста
postsRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  postsController.deletePost.bind(postsController)
);
