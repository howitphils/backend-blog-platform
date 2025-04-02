import { Router } from "express";

import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { validateParamsId } from "../middlewares/validateParamsId";
import { usersController } from "./controllers/users-controller";
import { userBodyValidators } from "../middlewares/body-validations/users-body-validators";
import { bodyValidationResult } from "../middlewares/validation-result";

export const usersRouter = Router();

// Получение юзеров
usersRouter.get("/", authGuard, usersController.getUsers);

// Создание юзера
usersRouter.post(
  "/",
  authGuard,
  userBodyValidators,
  bodyValidationResult,
  usersController.createUser
);

// Удаление юзера
usersRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  usersController.deleteUser
);
