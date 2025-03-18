import { Router } from "express";

import { blogsBodyValidator } from "../middlewares/blogs-body-validators/blogs-validators";
import { authGuard } from "../middlewares/auth-validator";
import { bodyValidationResult } from "../middlewares/validation-result";
import { blogsController } from "./controllers/blogs-controller";
import { validateParamsId } from "../middlewares/validateParamsId";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getBlogs);
blogsRouter.get("/:id", validateParamsId, blogsController.getBlogById);
blogsRouter.get(
  "/:id/posts",
  validateParamsId,
  blogsController.getPostsByBlogId
);
blogsRouter.post(
  "/:id/posts",
  validateParamsId,
  blogsController.createPostForBlog
);
blogsRouter.post(
  "/",
  authGuard,
  blogsBodyValidator,
  bodyValidationResult,
  blogsController.createBlog
);
blogsRouter.put(
  "/:id",
  authGuard,
  validateParamsId,
  blogsBodyValidator,
  bodyValidationResult,
  blogsController.updateBlog
);
blogsRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  blogsController.deleteBlog
);
