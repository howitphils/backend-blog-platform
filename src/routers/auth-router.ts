import { Router } from "express";

import { bodyValidationResult } from "../middlewares/validation-result";
import { authController } from "./controllers/auth-controller";
import { loginBodyValidators } from "../middlewares/body-validations/login-body-validators";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";

export const authRouter = Router();

// Логинизация
authRouter.post(
  "/login",
  loginBodyValidators,
  bodyValidationResult,
  authController.loginUser
);
// Логинизация
authRouter.get("/me", jwtAuthGuard, authController.getMyInfo);
