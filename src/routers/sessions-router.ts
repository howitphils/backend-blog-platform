import { Router } from "express";

import { refreshTokenValidator } from "../middlewares/auth/cookie-auth-validator";
import { sessionsController } from "../composition-root";

export const sessionsRouter = Router();

sessionsRouter.get(
  "/devices",
  refreshTokenValidator,
  sessionsController.getAllSessions.bind(sessionsController)
);

sessionsRouter.delete(
  "/devices/:deviceId",
  refreshTokenValidator,
  sessionsController.deleteSession.bind(sessionsController)
);

sessionsRouter.delete(
  "/devices",
  refreshTokenValidator,
  sessionsController.deleteAllSessions.bind(sessionsController)
);
