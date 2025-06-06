import { Router } from "express";

import { bodyValidationResult } from "../middlewares/validation-result";
import { authController } from "./controllers/auth-controller";
import { loginBodyValidators } from "../middlewares/body-validations/login-body-validators";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { userBodyValidators } from "../middlewares/body-validations/users-body-validators";
import { resendEmailBodyValidators } from "../middlewares/body-validations/resend-email-body-validations";
import { confirmationCodeBodyValidators } from "../middlewares/body-validations/confirm-code-body-validations";
import { refreshTokenValidator } from "../middlewares/auth/cookie-auth-validator";
import { apiCallsGuard } from "../middlewares/apiCallsGuard";

export const authRouter = Router();

authRouter.post(
  "/login",
  apiCallsGuard,
  loginBodyValidators,
  bodyValidationResult,
  authController.loginUser
);

authRouter.post("/logout", refreshTokenValidator, authController.logout);

authRouter.post(
  "/refresh-token",
  refreshTokenValidator,
  authController.refreshTokens
);

authRouter.get("/me", jwtAuthGuard, authController.getMyInfo);

authRouter.post(
  "/registration",
  apiCallsGuard,
  userBodyValidators,
  bodyValidationResult,
  authController.registerUser
);

authRouter.post(
  "/registration-confirmation",
  apiCallsGuard,
  confirmationCodeBodyValidators,
  bodyValidationResult,
  authController.confirmRegistration
);

authRouter.post(
  "/registration-email-resending",
  apiCallsGuard,
  resendEmailBodyValidators,
  bodyValidationResult,
  authController.resendConfirmation
);
