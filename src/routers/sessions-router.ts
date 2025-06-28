import { container } from "./../composition-root";
import { Router } from "express";

import { refreshTokenValidator } from "../middlewares/auth/cookie-auth-validator";
import { SessionsController } from "./controllers/sessions-controller";

const sessionsController = container.get(SessionsController);

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
