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
import { confrimPasswordRecoveryValidators } from "../middlewares/body-validations/confirm-recover-password-body-validators";
import { APP_CONFIG } from "../settings";

export const authRouter = Router();

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.LOGIN,
  apiCallsGuard,
  loginBodyValidators,
  bodyValidationResult,
  authController.loginUser
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY,
  apiCallsGuard,
  resendEmailBodyValidators,
  bodyValidationResult,
  authController.recoverPassword
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY,
  apiCallsGuard,
  confrimPasswordRecoveryValidators,
  bodyValidationResult,
  authController.confirmPasswordRecovery
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.LOGOUT,
  refreshTokenValidator,
  authController.logout
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REFRESH_TOKEN,
  refreshTokenValidator,
  authController.refreshTokens
);

authRouter.get(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.ME,
  jwtAuthGuard,
  authController.getMyInfo
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REGISTRATION,
  apiCallsGuard,
  userBodyValidators,
  bodyValidationResult,
  authController.registerUser
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REGISTRATION_CONFIRMATION,
  apiCallsGuard,
  confirmationCodeBodyValidators,
  bodyValidationResult,
  authController.confirmRegistration
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REGISTRATION_EMAIL_RESENDING,
  apiCallsGuard,
  resendEmailBodyValidators,
  bodyValidationResult,
  authController.resendConfirmation
);
