import { Router } from "express";

import { blogsBodyValidator } from "../middlewares/body-validations/blogs-body-validators";
import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { bodyValidationResult } from "../middlewares/validation-result";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { postsBodyValidator } from "../middlewares/body-validations/posts-body-validators";
import { container } from "../composition-root";
import { BlogsController } from "./controllers/blogs-controller";

const blogsController = container.get(BlogsController);

export const blogsRouter = Router();

// Получение всех блогов
blogsRouter.get("/", blogsController.getBlogs.bind(blogsController));

// Получение блога по айди
blogsRouter.get(
  "/:id",
  validateParamsId,
  blogsController.getBlogById.bind(blogsController)
);

// Получение постов по айди блога
blogsRouter.get(
  "/:id/posts",
  validateParamsId,
  blogsController.getPostsByBlogId.bind(blogsController)
);

// Создание поста по айди блога
blogsRouter.post(
  "/:id/posts",
  authGuard,
  validateParamsId,
  postsBodyValidator,
  bodyValidationResult,
  blogsController.createPostForBlog.bind(blogsController)
);

// Создание блога
blogsRouter.post(
  "/",
  authGuard,
  blogsBodyValidator,
  bodyValidationResult,
  blogsController.createBlog.bind(blogsController)
);

// Обновление блога
blogsRouter.put(
  "/:id",
  authGuard,
  validateParamsId,
  blogsBodyValidator,
  bodyValidationResult,
  blogsController.updateBlog.bind(blogsController)
);

// Удаление блога
blogsRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  blogsController.deleteBlog.bind(blogsController)
);
