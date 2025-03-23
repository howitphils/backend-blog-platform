import { Router } from "express";

import { bodyValidationResult } from "../middlewares/validation-result";
import { authController } from "./controllers/auth-controller";
import { loginBodyValidators } from "../middlewares/login-body-validators";

export const authRouter = Router();

// Логинизация
authRouter.post(
  "/login",
  loginBodyValidators,
  bodyValidationResult,
  authController.checkUser
);
