import { bodyValidationResult } from "./../middlewares/validation-result";
import { postsBodyValidator } from "./../middlewares/posts-body-validators/posts-validators";
import { Router } from "express";

import { authGuard } from "../middlewares/auth-validator";
import { postsController } from "./controllers/posts-controller";
import { validateParamsId } from "../middlewares/validateParamsId";

export const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/:id", validateParamsId, postsController.getPostById);
postsRouter.post(
  "/",
  authGuard,
  postsBodyValidator,
  bodyValidationResult,
  postsController.createPost
);
postsRouter.put(
  "/:id",
  authGuard,
  validateParamsId,
  postsBodyValidator,
  bodyValidationResult,
  postsController.updatePost
);
postsRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  postsController.deletePost
);
