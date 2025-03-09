import { bodyValidationResult } from "./../middlewares/validation-result";
import { postsBodyValidator } from "./../middlewares/posts-body-validators/posts-validators";
import { Router } from "express";

import { authGuard } from "../middlewares/auth-validator";
import { postsController } from "../controllers/posts-controller";

export const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
// postsRouter.get("/:id", postsController.getPostById);
// postsRouter.post(
//   "/",
//   authGuard,
//   postsBodyValidator,
//   bodyValidationResult,
//   postsController.createPost
// );
// postsRouter.put(
//   "/:id",
//   authGuard,
//   postsBodyValidator,
//   bodyValidationResult,
//   postsController.updatePost
// );
// postsRouter.delete("/:id", authGuard, postsController.deletePost);
