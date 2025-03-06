import { Router } from "express";

import { blogsBodyValidator } from "../middlewares/blogs-body-validators/blogs-validators";
import { authGuard } from "../middlewares/auth-validator";
import { bodyValidationResult } from "../middlewares/validation-result";
import { blogsController } from "../controllers/blogs-controller";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getBlogs);
blogsRouter.get("/:id", blogsController.getBlogById);
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
  blogsBodyValidator,
  bodyValidationResult,
  blogsController.updateBlog
);
blogsRouter.delete("/:id", authGuard, blogsController.deleteBlog);
