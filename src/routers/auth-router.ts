import { Router } from "express";

import { bodyValidationResult } from "../middlewares/validation-result";
import { loginBodyValidators } from "../middlewares/body-validations/login-body-validators";
import { jwtAuthGuard } from "../middlewares/auth/jwt-auth-validator";
import { userBodyValidators } from "../middlewares/body-validations/users-body-validators";
import { resendEmailBodyValidators } from "../middlewares/body-validations/resend-email-body-validations";
import { confirmationCodeBodyValidators } from "../middlewares/body-validations/confirm-code-body-validations";
import { refreshTokenValidator } from "../middlewares/auth/cookie-auth-validator";
import { apiCallsGuard } from "../middlewares/api-calls-guard";
import { confrimPasswordRecoveryValidators } from "../middlewares/body-validations/confirm-recover-password-body-validators";
import { APP_CONFIG } from "../settings";
import { container } from "../composition-root";
import { AuthController } from "./controllers/auth-controller";

const authController = container.get(AuthController);

export const authRouter = Router();

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.LOGIN,
  apiCallsGuard,
  loginBodyValidators,
  bodyValidationResult,
  authController.loginUser.bind(authController)
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.PASSWORD_RECOVERY,
  apiCallsGuard,
  resendEmailBodyValidators,
  bodyValidationResult,
  authController.recoverPassword.bind(authController)
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.CONFIRM_PASSWORD_RECOVERY,
  apiCallsGuard,
  confrimPasswordRecoveryValidators,
  bodyValidationResult,
  authController.confirmPasswordRecovery.bind(authController)
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.LOGOUT,
  refreshTokenValidator,
  authController.logout.bind(authController)
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REFRESH_TOKEN,
  refreshTokenValidator,
  authController.refreshTokens.bind(authController)
);

authRouter.get(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.ME,
  jwtAuthGuard,
  authController.getMyInfo.bind(authController)
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REGISTRATION,
  apiCallsGuard,
  userBodyValidators,
  bodyValidationResult,
  authController.registerUser.bind(authController)
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REGISTRATION_CONFIRMATION,
  apiCallsGuard,
  confirmationCodeBodyValidators,
  bodyValidationResult,
  authController.confirmRegistration.bind(authController)
);

authRouter.post(
  APP_CONFIG.ENDPOINT_PATHS.AUTH.REGISTRATION_EMAIL_RESENDING,
  apiCallsGuard,
  resendEmailBodyValidators,
  bodyValidationResult,
  authController.resendConfirmation.bind(authController)
);
