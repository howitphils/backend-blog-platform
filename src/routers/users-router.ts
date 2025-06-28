import { UsersController } from "./controllers/users-controller";
import { Router } from "express";

import { authGuard } from "../middlewares/auth/basic-auth-validator";
import { validateParamsId } from "../middlewares/validate-paramsId";
import { userBodyValidators } from "../middlewares/body-validations/users-body-validators";
import { bodyValidationResult } from "../middlewares/validation-result";
import { container } from "../composition-root";

const usersController = container.get(UsersController);

export const usersRouter = Router();

// Получение юзеров
usersRouter.get("/", authGuard, usersController.getUsers.bind(usersController));

// Создание юзера
usersRouter.post(
  "/",
  authGuard,
  userBodyValidators,
  bodyValidationResult,
  usersController.createUser.bind(usersController)
);

// Удаление юзера
usersRouter.delete(
  "/:id",
  authGuard,
  validateParamsId,
  usersController.deleteUser.bind(usersController)
);
