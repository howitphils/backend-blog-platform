import { bodyValidationResult } from "./../middlewares/validation-result";
import { postsBodyValidator } from "../middlewares/body-validations/posts-body-validators";
import { Router } from "express";

import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { postsController } from "./controllers/posts-controller";
import { validateParamsId } from "../middlewares/validateParamsId";

export const postsRouter = Router();

// Получение постов
postsRouter.get("/", postsController.getPosts);

// Получение поста по айди
postsRouter.get("/:id", validateParamsId, postsController.getPostById);

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
