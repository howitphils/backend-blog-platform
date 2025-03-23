import { bodyValidationResult } from "./../middlewares/validation-result";
import { postsBodyValidator } from "./../middlewares/posts-body-validators/posts-validators";
import { Router } from "express";

import { authGuard } from "../middlewares/auth-validator";
import { validateParamsId } from "../middlewares/validateParamsId";
import { usersController } from "./controllers/users-controller";

export const usersRouter = Router();

// Получение юзеров
usersRouter.get("/", usersController.getUsers);

// Создание юзера
usersRouter.post(
  "/",
  authGuard,
  // postsBodyValidator,
  // bodyValidationResult,
  usersController.createUser
);

// Удаление юзера
usersRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  usersController.deleteUser
);
