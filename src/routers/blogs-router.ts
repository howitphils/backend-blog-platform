import { Router } from "express";

import { blogsBodyValidator } from "../middlewares/body-validations/blogs-body-validators";
import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { bodyValidationResult } from "../middlewares/validation-result";
import { blogsController } from "./controllers/blogs-controller";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { postsBodyValidator } from "../middlewares/body-validations/posts-body-validators";

export const blogsRouter = Router();

// Получение всех блогов
blogsRouter.get("/", blogsController.getBlogs);

// Получение блога по айди
blogsRouter.get("/:id", validateParamsId, blogsController.getBlogById);

// Получение постов по айди блога
blogsRouter.get(
  "/:id/posts",
  validateParamsId,
  blogsController.getPostsByBlogId
);

// Создание поста по айди блога
blogsRouter.post(
  "/:id/posts",
  authGuard,
  validateParamsId,
  postsBodyValidator,
  bodyValidationResult,
  blogsController.createPostForBlog
);

// Создание блога
blogsRouter.post(
  "/",
  authGuard,
  blogsBodyValidator,
  bodyValidationResult,
  blogsController.createBlog
);

// Обновление блога
blogsRouter.put(
  "/:id",
  authGuard,
  validateParamsId,
  blogsBodyValidator,
  bodyValidationResult,
  blogsController.updateBlog
);

// Удаление блога
blogsRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  blogsController.deleteBlog
);
