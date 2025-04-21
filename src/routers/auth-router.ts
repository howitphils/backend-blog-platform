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

// Информация профиля
authRouter.get("/me", jwtAuthGuard, authController.getMyInfo);

authRouter.post("/registration", authController.registerUser);

authRouter.post(
  "/registration-confirmation",
  authController.confirmRegistration
);

authRouter.post(
  "/registration-email-resending",
  authController.resendConfirmation
);
