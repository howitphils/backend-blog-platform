import { Router } from "express";

import { refreshTokenValidator } from "../middlewares/auth/cookie-auth-validator";
import { sessionsController } from "./controllers/sessions-controller";

export const sessionsRouter = Router();

sessionsRouter.get(
  "/devices",
  refreshTokenValidator,
  sessionsController.getAllSessions
);

sessionsRouter.delete(
  "/devices/:deviceId",
  refreshTokenValidator,
  sessionsController.deleteSession
);

sessionsRouter.delete(
  "/devices",
  refreshTokenValidator,
  sessionsController.deleteAllSessions
);
